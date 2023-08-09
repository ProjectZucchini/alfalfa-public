import { User } from "@alfalfa/database/generated/client/index.js";
import { prisma } from "../prisma-client.js";

export async function findByUser(user: User) {
  if (!user.slackUserId) {
    throw Error(`No SlackUser associated with the User: ${user.id}`);
  }

  return prisma.slackUser.findFirstOrThrow({
    where: {
      id: user.slackUserId,
    },
  });
}

export async function findById(id: number) {
  return prisma.slackUser.findUnique({
    where: {
      id,
    },
  });
}
