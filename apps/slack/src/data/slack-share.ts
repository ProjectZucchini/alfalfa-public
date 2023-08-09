import {
  Organization,
  User,
} from "@alfalfa/database/generated/client/index.js";
import { prisma } from "../prisma-client.js";

export async function getTotalSharedByOrganization(organization: Organization) {
  return await prisma.slackShare.count({
    where: {
      slackUser: {
        slackWorkspaceId: organization.slackWorkspaceId || -1,
      },
    },
  });
}

export async function getTotalSharedByUser(
  organization: Organization,
  user: User,
) {
  return await prisma.slackShare.count({
    where: {
      slackUser: {
        id: user.slackUserId || -1,
        slackWorkspaceId: organization.slackWorkspaceId || -1,
      },
    },
  });
}

export async function getAverageSharedByOrganization(
  organization: Organization,
) {
  const result = await prisma.slackShare.groupBy({
    by: ["slackUserId"],
    _count: true,
    where: {
      slackUser: {
        slackWorkspaceId: organization.slackWorkspaceId || -1,
      },
    },
  });

  const totalCount = result.reduce((acc, record) => acc + record._count, 0);

  return Math.floor(totalCount / result.length) || 0;
}
