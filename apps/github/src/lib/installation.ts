import {
  GitHubOrganization,
  Prisma,
} from "@alfalfa/database/generated/client/index.js";
import { prisma } from "../prisma-client.js";
import {
  createGitHubOrganization,
  getGitHubOrganizationByOrganization,
  updateGitHubOrganization,
} from "../data/github-organization.js";
import { findBySlackUserId } from "../data/organization.js";
import { createGithubUser } from "../data/github-user.js";
import { getInstallationClient } from "./github-client.js";

export async function completeInstallation(
  slackUserId: number,
  installationId: number,
) {
  let organization;
  try {
    organization = await findBySlackUserId(slackUserId);
  } catch (err) {
    if (err instanceof Prisma.NotFoundError) {
      console.error(
        `Installation Error. Could not find Organization for SlackUser ${slackUserId}.`,
      );
    }
    throw err;
  }

  const installationClient = getInstallationClient(installationId);

  const appInstallation = await installationClient.rest.apps.getInstallation({
    installation_id: installationId,
  });

  if (!appInstallation.data.account?.id) {
    throw new Error(
      `Installation Error. Could not find account details for App Installation ${installationId}`,
    );
  }

  let existingGithubOrganization: GitHubOrganization | undefined;
  try {
    existingGithubOrganization = await getGitHubOrganizationByOrganization(
      appInstallation.data.account.id,
      {
        includeDeleted: true,
      },
    );
  } catch (error) {
    if (error instanceof Prisma.NotFoundError) {
      // This is fine. Most of the time the org shouldn't exist yet
    } else {
      throw error;
    }
  }

  if (existingGithubOrganization) {
    if ("login" in appInstallation.data.account) {
      console.log(
        `Re-enabling GitHub organization for: ${appInstallation.data.account.login}-${appInstallation.data.id}`,
      );
    } else {
      console.log(
        `Re-enabling GitHub organization for: ${appInstallation.data.account.slug}-${appInstallation.data.id}`,
      );
    }
    await updateGitHubOrganization(existingGithubOrganization, {
      githubInstallationId: appInstallation.data.id,
      deletedAt: null,
    });
    return;
  }

  let accountLogin = "";
  let accountType = "";
  if ("login" in appInstallation.data.account) {
    accountLogin = appInstallation.data.account.login;
    accountType = appInstallation.data.account.type;
  } else {
    accountLogin = appInstallation.data.account.slug;
    accountType = "Enterprise";
  }

  const githubOrganization = await createGitHubOrganization(
    appInstallation.data.account.id,
    accountLogin,
    appInstallation.data.id,
    accountType,
  );

  const { data: members } = await installationClient.rest.orgs.listMembers({
    org: githubOrganization.name,
  });

  for (const member of members) {
    await createGithubUser(member, organization);
  }

  await prisma.organization.update({
    where: {
      id: organization.id,
    },
    data: {
      githubOrganizationId: githubOrganization.id,
    },
  });
}
