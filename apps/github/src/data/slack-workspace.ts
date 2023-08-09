import { prisma } from "../prisma-client.js";
import { SlackUser } from "@alfalfa/database/generated/client/index.js";

export async function getWorkspaceBySlackUser(slackUser: SlackUser) {
  return await prisma.slackWorkspace.findFirstOrThrow({
    where: {
      id: slackUser.slackWorkspaceId,
    },
  });
}
