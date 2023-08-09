import { GitHubArtifactType } from "@alfalfa/database/generated/client/index.js";
import { type Block, type KnownBlock } from "@slack/web-api";
import { findAchievementsByUser } from "../../data/achievement.js";
import { formatLocalDate } from "../../helpers/dates.js";

export interface AchievementCardProps {
  title: string;
  description: string;
  imageUrl: string;
  earnedDate: string;
  earnedLink: string;
}

export function AchievementCard({
  title,
  description,
  imageUrl,
  earnedDate,
  earnedLink,
}: AchievementCardProps): (Block | KnownBlock)[] {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*${title}*\n\n${description}`,
      },
      accessory: {
        type: "image",
        image_url: imageUrl,
        alt_text: `${title} thumbnail`,
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

export function formatUserAchievement(
  userAchievement: Awaited<ReturnType<typeof findAchievementsByUser>>[0],
) {
  return {
    title: userAchievement.achievement.name,
    description: userAchievement.achievement.description,
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
    imageUrl: userAchievement.achievement.imageUrl,
  };
}
