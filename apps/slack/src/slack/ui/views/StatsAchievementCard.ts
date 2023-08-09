import {
  formatLocalDate,
  findAchievementsByOrganization,
} from "@alfalfa/slack-lib";
import { GitHubArtifactType } from "@alfalfa/database/generated/client/index.js";

interface StatsAchievementCardProps {
  userId: string;
  userName: string;
  userImageUrl: string;
  githubUserName: string;
  title: string;
  earnedDate: string;
  earnedLink: string;
}

export function StatsAchievementCard({
  userId,
  userName,
  userImageUrl,
  githubUserName,
  title,
  earnedDate,
  earnedLink,
}: StatsAchievementCardProps) {
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
          type: "image",
          image_url: userImageUrl,
          alt_text: userName,
        },
        {
          type: "mrkdwn",
          text: `<@${userId}> (<https://github.com/${githubUserName}|${githubUserName}>)`,
        },
      ],
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

export function formatStatsAchievement(
  userAchievement: Awaited<
    ReturnType<typeof findAchievementsByOrganization>
  >[0],
) {
  return {
    githubUserName: userAchievement.user.githubUser.login,
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
