import { type Installation } from "@octokit/webhooks-types";
import {
  type GitHubOrganization,
  GithubOrganizationType,
  Prisma,
} from "@alfalfa/database/generated/client/index.js";
import { prisma } from "../prisma-client.js";

export async function getGitHubOrganizationByOrganization(
  githubOrganizationExternalId: number,
  options: {
    includeDeleted: boolean;
  } = {
    includeDeleted: false,
  },
): Promise<GitHubOrganization> {
  return prisma.gitHubOrganization.findFirstOrThrow({
    where: {
      externalId: githubOrganizationExternalId,
      ...(!options.includeDeleted && {
        deletedAt: null,
      }),
    },
  });
}

export async function getGitHubOrganizationByInstallation(
  installation: Installation,
  options: {
    includeDeleted: boolean;
  } = {
    includeDeleted: false,
  },
): Promise<GitHubOrganization> {
  return prisma.gitHubOrganization.findFirstOrThrow({
    where: {
      githubInstallationId: installation.id,
      ...(!options.includeDeleted && {
        deletedAt: null,
      }),
    },
  });
}

export async function createGitHubOrganization(
  externalId: number,
  name: string,
  installationId: number,
  organizationType: string,
): Promise<GitHubOrganization> {
  return prisma.gitHubOrganization.create({
    data: {
      externalId,
      githubInstallationId: installationId,
      name,
      type:
        organizationType === "User"
          ? GithubOrganizationType.USER
          : organizationType === "Enterprise"
          ? GithubOrganizationType.ENTERPRISE
          : GithubOrganizationType.ORGANIZATION,
    },
  });
}

export async function updateGitHubOrganization(
  githubOrganization: GitHubOrganization,
  gitHubOrganizationUpdate: Omit<
    Prisma.GitHubOrganizationUpdateInput,
    "createdAt" | "updatedAt"
  >,
) {
  return prisma.gitHubOrganization.update({
    where: {
      id: githubOrganization.id,
    },
    data: gitHubOrganizationUpdate,
  });
}
