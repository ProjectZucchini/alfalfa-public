import {
  Organization,
  User,
} from "@alfalfa/database/generated/client/index.js";
import { prisma } from "../prisma-client.js";

export async function findAchievementsByUser(
  user: User,
  options?: {
    limit?: number;
    sort?: "asc" | "desc";
  },
) {
  return prisma.userAchievement.findMany({
    where: {
      user: {
        id: user.id,
      },
    },
    ...(options?.sort && {
      orderBy: [
        {
          id: options.sort,
        },
      ],
    }),
    ...(options?.limit && {
      take: options.limit,
    }),
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

export async function findAchievementsByOrganization(
  organization: Organization,
  options?: {
    limit?: number;
    sort?: "asc" | "desc";
  },
) {
  return prisma.userAchievement.findMany({
    where: {
      user: {
        organizationId: organization.id,
      },
    },
    ...(options?.sort && {
      orderBy: [
        {
          id: options.sort,
        },
      ],
    }),
    ...(options?.limit && {
      take: options.limit,
    }),
    include: {
      achievement: true,
      user: {
        include: {
          githubUser: true,
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
}
