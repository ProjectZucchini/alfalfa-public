import { prisma } from "../prisma-client.js";

export async function findOrCreate(teamId: string, externalId: string) {
  let slackUser = await prisma.slackUser.findUnique({
    where: {
      externalId,
    },
    include: {
      users: true,
    },
  });

  if (!slackUser) {
    slackUser = await prisma.slackUser.create({
      data: {
        externalId,
        slackWorkspace: {
          connect: {
            teamId,
          },
        },
      },
      include: {
        users: true,
      },
    });
  }
  return slackUser;
}
