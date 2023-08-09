import { type Prisma } from "@alfalfa/database/generated/client/index.js";
import { type Installation, type InstallationQuery } from "@slack/bolt";
import { prisma } from "../prisma-client.js";

export async function storeInstallation(installation: Installation) {
  if (!installation.team) {
    throw Error("Enterprise installation not supported");
  }

  await prisma.slackWorkspace.upsert({
    where: { teamId: installation.team.id },
    update: {
      teamId: installation.team.id,
      deletedAt: null,
      installation: installation as unknown as Prisma.InputJsonObject,
    },
    create: {
      teamId: installation.team.id,
      installation: installation as unknown as Prisma.InputJsonObject,
      organization: {
        create: {},
      },
    },
  });
}

export async function fetchInstallation(
  installQuery: InstallationQuery<false>,
) {
  if (!installQuery.teamId) {
    throw Error("Enterprise installation not supported");
  }

  return (
    await prisma.slackWorkspace.findFirstOrThrow({
      where: {
        teamId: installQuery.teamId,
      },
    })
  ).installation as unknown as Installation;
}

export async function deleteInstallation(
  installQuery: InstallationQuery<false>,
) {
  if (!installQuery.teamId) {
    throw Error("Enterprise installation not supported");
  }

  return await prisma.slackWorkspace.update({
    where: {
      teamId: installQuery.teamId,
    },
    data: {
      deletedAt: new Date(),
    },
  });
}
