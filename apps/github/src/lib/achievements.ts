import {
  type IssuesOpenedEvent,
  type PullRequestOpenedEvent,
  type PullRequestClosedEvent,
  type PullRequestReviewSubmittedEvent,
} from "@octokit/webhooks-types";
import {
  AchievementUserQualifyRestriction,
  GitHubArtifactType,
  Prisma,
  type Achievement,
  type User,
} from "@alfalfa/database/generated/client/index.js";
import { createAchievements } from "../data/achievement.js";
import { getByRepository } from "../data/github-repository.js";
import { dmAchievements, updateHomeScreen } from "./slack.js";

const artifactTypeMap = {
  issues: GitHubArtifactType.ISSUE,
  pull_request: GitHubArtifactType.PULL_REQUEST,
  pull_request_review: GitHubArtifactType.PULL_REQUEST,
};

export async function grantAchievements(
  achievements: {
    users: User[];
    achievement: Achievement;
  }[],
  eventName: "issues" | "pull_request" | "pull_request_review",
  payload:
    | IssuesOpenedEvent
    | PullRequestOpenedEvent
    | PullRequestClosedEvent
    | PullRequestReviewSubmittedEvent,
) {
  if (!achievements.length) {
    return;
  }

  const repository = await getByRepository(payload.repository);
  const earnedAchievements = await createAchievements(achievements, {
    artifactType: artifactTypeMap[eventName],
    artifactId: getArtifactId(payload),
    githubRepositoryId: repository.id,
  });

  await dmAchievements(earnedAchievements);
  for (const achievement of achievements) {
    for (const user of achievement.users) {
      await updateHomeScreen(user);
    }
  }
}

function getArtifactId(
  payload:
    | IssuesOpenedEvent
    | PullRequestOpenedEvent
    | PullRequestClosedEvent
    | PullRequestReviewSubmittedEvent,
): number {
  if ("issue" in payload) {
    return payload.issue.number;
  }

  if ("pull_request" in payload) {
    return payload.pull_request.number;
  }

  throw Error("Unable to determine artifact id");
}

const userWithAchievements = Prisma.validator<Prisma.UserArgs>()({
  include: {
    userAchievements: {
      include: {
        achievement: true,
        userAchievementReason: {
          include: {
            githubRepository: {
              include: {
                githubOrganization: true,
              },
            },
          },
        },
      },
    },
  },
});
type UserWithAchievements = Prisma.UserGetPayload<typeof userWithAchievements>;

const repositoryWithOrganization =
  Prisma.validator<Prisma.GitHubRepositoryArgs>()({
    include: {
      githubOrganization: true,
    },
  });
type RepositoryWithOrganization = Prisma.GitHubRepositoryGetPayload<
  typeof repositoryWithOrganization
>;

export function hasUserReceivedAchievement(
  user: UserWithAchievements,
  achievement: Achievement,
  repository: RepositoryWithOrganization,
): boolean {
  return user.userAchievements.some((userAchievement) => {
    if (
      achievement.userQualifyRestriction ===
      AchievementUserQualifyRestriction.GLOBAL
    ) {
      return userAchievement.achievement.type === achievement.type;
    }

    if (
      achievement.userQualifyRestriction ===
      AchievementUserQualifyRestriction.ORGANIZATION
    ) {
      return (
        userAchievement.userAchievementReason?.githubRepository
          .githubOrganization.id === repository.githubOrganization.id &&
        userAchievement.achievement.type === achievement.type
      );
    }

    if (
      achievement.userQualifyRestriction ===
      AchievementUserQualifyRestriction.REPOSITORY
    ) {
      return (
        userAchievement.userAchievementReason?.githubRepository.id ===
          repository.id && userAchievement.achievement.type === achievement.type
      );
    }
  });
}
