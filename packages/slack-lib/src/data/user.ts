import { Organization } from "@alfalfa/database/generated/client/index.js";
import { prisma } from "../prisma-client.js";

export async function findUserBySlackUserId(slackUserId: string) {
  return prisma.user.findFirstOrThrow({
    where: {
      slackUser: {
        externalId: slackUserId,
      },
    },
  });
}

export async function findUserByOrganization(organization: Organization) {
  return prisma.user.findMany({
    where: {
      organization: {
        id: organization.id,
      },
    },
    include: {
      githubUser: true,
      slackUser: true,
    },
  });
}
