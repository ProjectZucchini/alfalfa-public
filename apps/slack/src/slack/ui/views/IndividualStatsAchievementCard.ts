import { findAchievementsByUser, formatLocalDate } from "@alfalfa/slack-lib";
import { GitHubArtifactType } from "@alfalfa/database/generated/client/index.js";

interface IndividualStatsAchievementCardProps {
  title: string;
  earnedDate: string;
  earnedLink: string;
}

export function IndividualStatsAchievementCard({
  title,
  earnedDate,
  earnedLink,
}: IndividualStatsAchievementCardProps) {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*${title}*`,
      },
    },
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: `Earned *${earnedDate}* for ${earnedLink}`,
        },
      ],
    },
  ];
}

export function formatIndividualStatsAchievement(
  userAchievement: Awaited<ReturnType<typeof findAchievementsByUser>>[0],
): IndividualStatsAchievementCardProps {
  return {
    title: userAchievement.achievement.name,
    earnedDate: formatLocalDate(userAchievement.createdAt),
    earnedLink: `<https://github.com/${userAchievement.userAchievementReason
      ?.githubRepository.githubOrganization.name}/${userAchievement
      .userAchievementReason?.githubRepository.name}/${
      userAchievement.userAchievementReason?.artifactType ===
      GitHubArtifactType.PULL_REQUEST
        ? "pull"
        : "issues"
    }/${userAchievement.userAchievementReason?.artifactId} | ${userAchievement
      .userAchievementReason?.githubRepository.githubOrganization
      .name}/${userAchievement.userAchievementReason?.githubRepository
      .name}#${userAchievement.userAchievementReason?.artifactId}>`,
  };
}
