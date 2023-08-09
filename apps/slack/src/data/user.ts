import { Organization } from "@alfalfa/database/generated/client/index.js";
import { prisma } from "../prisma-client.js";
import { findOrCreate } from "./slack-user.js";

export async function findById(organization: Organization, userId: number) {
  return prisma.user.findFirstOrThrow({
    where: {
      id: userId,
      organization: {
        id: organization.id,
      },
    },
  });
}

export async function updateGitHubSlackLink(
  organization: Organization,
  githubUserId: number,
  slackTeamId: string,
  slackExternalId: string,
): Promise<string[]> {
  const existingUser = await prisma.user.findUniqueOrThrow({
    where: {
      organizationId_githubUserId: {
        organizationId: organization.id,
        githubUserId,
      },
    },
    include: {
      slackUser: true,
    },
  });

  const updatedSlackUserIds: string[] = [];

  const slackUser = await findOrCreate(slackTeamId, slackExternalId);

  if (slackUser.id !== existingUser.slackUserId) {
    if (slackUser.users.length > 0) {
      for (const user of slackUser.users) {
        await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            slackUserId: null,
          },
        });
      }
    }
    await prisma.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        slackUserId: slackUser.id,
      },
    });

    updatedSlackUserIds.push(slackUser.externalId);
    existingUser.slackUser &&
      updatedSlackUserIds.push(existingUser.slackUser.externalId);
  }

  return updatedSlackUserIds;
}
