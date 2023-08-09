import { parseArgs } from "node:util";
import { prisma } from "../prisma-client.js";
import { dmAchievements, updateHomeScreen } from "../lib/slack.js";

const {
  values: { achievementId, userId },
} = parseArgs({
  options: {
    achievementId: {
      type: "string",
      short: "a",
    },
    userId: {
      type: "string",
      short: "u",
    },
  },
});

if (!achievementId) {
  throw Error("AchievementId is required");
}

if (!userId) {
  throw Error("UserId is required");
}

const achievement = await prisma.achievement.findUniqueOrThrow({
  where: {
    id: parseInt(achievementId),
  },
});

const userAchievement = await prisma.userAchievement.create({
  data: {
    achievementId: achievement.id,
    userId: parseInt(userId),
  },
  include: {
    achievement: true,
    user: {
      include: {
        slackUser: true,
      },
    },
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
});

await dmAchievements([userAchievement]);
await updateHomeScreen(userAchievement.user);
