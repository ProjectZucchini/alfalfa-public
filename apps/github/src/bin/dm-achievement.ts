import { parseArgs } from "node:util";
import { prisma } from "../prisma-client.js";
import { dmAchievements } from "../lib/slack.js";

const {
  values: { userId },
} = parseArgs({
  options: {
    userId: {
      type: "string",
      short: "u",
    },
  },
});

if (!userId) {
  throw Error("UserId is required");
}

const mostRecentAchievement = await prisma.userAchievement.findFirstOrThrow({
  where: {
    userId: parseInt(userId),
  },
  orderBy: [
    {
      id: "desc",
    },
  ],
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

await dmAchievements([mostRecentAchievement]);
