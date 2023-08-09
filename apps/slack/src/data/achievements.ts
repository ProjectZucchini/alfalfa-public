import {
  Organization,
  User,
} from "@alfalfa/database/generated/client/index.js";
import { prisma } from "../prisma-client.js";

export async function findById(user: User, userAchievementId: number) {
  return prisma.userAchievement.findFirstOrThrow({
    where: {
      id: userAchievementId,
      userId: user.id,
    },
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
  });
}

export async function getTotalEarnedByUser(
  organization: Organization,
  user: User,
) {
  return await prisma.userAchievement.count({
    where: {
      user: {
        id: user.id,
        organizationId: organization.id,
      },
    },
  });
}

export async function getTotalEarnedByOrganization(organization: Organization) {
  return await prisma.userAchievement.count({
    where: {
      user: {
        organizationId: organization.id,
      },
    },
  });
}

export async function getAverageEarnedByOrganization(
  organization: Organization,
) {
  const result = await prisma.userAchievement.groupBy({
    by: ["userId"],
    _count: true,
    where: {
      user: {
        organizationId: organization.id,
      },
    },
  });

  const totalCount = result.reduce((acc, record) => acc + record._count, 0);

  return Math.floor(totalCount / result.length) || 0;
}
