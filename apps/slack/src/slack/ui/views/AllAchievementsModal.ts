import {
  AchievementCard,
  findAchievementsByUser,
  formatUserAchievement,
} from "@alfalfa/slack-lib";
import { ModalView } from "@slack/web-api";

interface AllAchievementsModalProps {
  userAchievements: Awaited<ReturnType<typeof findAchievementsByUser>>;
}

export function AllAchievementsModal({
  userAchievements,
}: AllAchievementsModalProps): ModalView {
  return {
    type: "modal",
    title: {
      type: "plain_text",
      text: "All Sprouts",
    },
    blocks: [
      ...userAchievements
        .map((userAchievement) => {
          return [
            ...AchievementCard(formatUserAchievement(userAchievement)),
            {
              type: "divider",
            },
          ];
        })
        .flat(),
    ],
  };
}
