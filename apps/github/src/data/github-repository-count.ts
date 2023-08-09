import { GitHubRepository } from "@alfalfa/database/generated/client/index.js";
import { prisma } from "../prisma-client.js";

export async function increaseGitHubRepositoryCounts(
  eventType: "pull_request.merged",
  repository: GitHubRepository,
) {
  let githubRepositoryCount = await prisma.gitHubRepositoryCounts.findFirst({
    where: {
      githubRepositoryId: repository.id,
    },
  });

  if (!githubRepositoryCount) {
    githubRepositoryCount = await prisma.gitHubRepositoryCounts.create({
      data: {
        githubRepositoryId: repository.id,
      },
    });
  }

  await prisma.gitHubRepositoryCounts.update({
    where: {
      id: githubRepositoryCount.id,
    },
    data: {
      ...(eventType === "pull_request.merged" && {
        pullRequestsMerged: {
          increment: 1,
        },
      }),
    },
  });
}

export async function getGitHubRepositoryCountsByOrganization(
  githubOrganizationId: number,
) {
  return prisma.gitHubRepositoryCounts.findMany({
    where: {
      githubRepository: {
        githubOrganizationId: githubOrganizationId,
      },
    },
  });
}
