import { type Repository, type User } from "@octokit/webhooks-types";
import {
  type GitHubOrganization,
  Prisma,
} from "@alfalfa/database/generated/client/index.js";
import { prisma } from "../prisma-client.js";
import { getGitHubOrganizationByOrganization } from "./github-organization.js";

export async function getByRepository(repository: Repository) {
  return prisma.gitHubRepository.findFirstOrThrow({
    where: {
      externalId: repository.id,
    },
    include: {
      githubOrganization: true,
      gitHubRepositoryCounts: true,
    },
  });
}

export async function getOrCreateByRepository(
  repository: Repository,
  organization: User,
) {
  try {
    return await getByRepository(repository);
  } catch (error) {
    if (error instanceof Prisma.NotFoundError) {
      const savedOrganization = await getGitHubOrganizationByOrganization(
        organization.id,
      );

      return create(repository, savedOrganization);
    }

    throw error;
  }
}

async function create(
  repository: Repository,
  githubOrganization: GitHubOrganization,
) {
  return prisma.gitHubRepository.create({
    data: {
      externalId: repository.id,
      name: repository.name,
      githubOrganization: {
        connect: {
          id: githubOrganization.id,
        },
      },
    },
    include: {
      githubOrganization: true,
      gitHubRepositoryCounts: true,
    },
  });
}
