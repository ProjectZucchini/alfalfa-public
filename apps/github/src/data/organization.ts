import { prisma } from "../prisma-client.js";

export async function findByExternalId(externalId: number) {
  return prisma.organization.findFirstOrThrow({
    where: {
      githubOrganization: {
        externalId,
      },
    },
  });
}

export async function findBySlackUserId(slackUserId: number) {
  const slackUser = await prisma.slackUser.findUniqueOrThrow({
    where: {
      id: slackUserId,
    },
    include: {
      slackWorkspace: {
        include: {
          organization: true,
        },
      },
    },
  });

  if (!slackUser.slackWorkspace.organization) {
    throw new Error(
      `Could not find Organization for Slack User ${slackUserId}`,
    );
  }

  return slackUser.slackWorkspace.organization;
}
