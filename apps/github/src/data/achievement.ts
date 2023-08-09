import { type EmitterWebhookEventName } from "@octokit/webhooks";
import {
  Achievement,
  Prisma,
  User as PrismaUser,
} from "@alfalfa/database/generated/client/index.js";
import { prisma } from "../prisma-client.js";

export async function findByEventName(
  eventName: EmitterWebhookEventName,
  includeDeleted: boolean,
) {
  return prisma.achievement.findMany({
    where: {
      githubEvents: {
        some: {
          githubEvent: {
            name: eventName,
          },
        },
      },
      ...(!includeDeleted && { deletedAt: null }),
    },
  });
}

export async function createAchievements(
  achievements: {
    users: PrismaUser[];
    achievement: Achievement;
  }[],
  achievementReason: Pick<
    Prisma.UserAchievementReasonUncheckedCreateInput,
    "artifactType" | "artifactId" | "githubRepositoryId"
  >,
) {
  const earnedAchievements = [];
  for (const achievement of achievements) {
    for (const user of achievement.users) {
      earnedAchievements.push(
        await prisma.userAchievement.create({
          data: {
            achievementId: achievement.achievement.id,
            userId: user.id,
            userAchievementReason: {
              create: {
                artifactType: achievementReason.artifactType,
                artifactId: achievementReason.artifactId,
                githubRepositoryId: achievementReason.githubRepositoryId,
              },
            },
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
        }),
      );
    }
  }

  return earnedAchievements;
}
