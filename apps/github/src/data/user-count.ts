import {
  GitHubRepository,
  User,
} from "@alfalfa/database/generated/client/index.js";
import { prisma } from "../prisma-client.js";

export async function increaseUserCounts(
  user: User,
  eventType:
    | "issues.opened"
    | "pull_request.opened"
    | "pull_request.merged"
    | "pull_request_review.submitted",
  repository: GitHubRepository,
) {
  let githubUserCount = await prisma.gitHubUserCounts.findFirst({
    where: {
      githubUser: {
        users: {
          every: {
            id: user.id,
          },
        },
      },
      githubRepositoryId: repository.id,
    },
  });

  if (!githubUserCount) {
    githubUserCount = await prisma.gitHubUserCounts.create({
      data: {
        githubUserId: user.id,
        githubRepositoryId: repository.id,
      },
    });
  }

  await prisma.gitHubUserCounts.update({
    where: {
      id: githubUserCount.id,
    },
    data: {
      ...(eventType === "issues.opened" && {
        issues: {
          increment: 1,
        },
      }),
      ...(eventType === "pull_request.opened" && {
        pullRequests: {
          increment: 1,
        },
      }),
      ...(eventType === "pull_request.merged" && {
        pullRequestsMerged: {
          increment: 1,
        },
      }),
      ...(eventType === "pull_request_review.submitted" && {
        reviews: {
          increment: 1,
        },
      }),
    },
  });
}
