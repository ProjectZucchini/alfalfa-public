import { prisma } from "../prisma-client.js";

export async function findBySlackTeamId(teamId: string) {
  const slackWorkspace = await prisma.slackWorkspace.findUniqueOrThrow({
    where: {
      teamId,
    },
    include: {
      organization: true,
    },
  });
  if (!slackWorkspace.organization) {
    throw new Error(
      `Organization for SlackWorkspace ${slackWorkspace.id} not found.`,
    );
  }
  return slackWorkspace.organization;
}
