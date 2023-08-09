import { type User as GHUser } from "@octokit/webhooks-types";
import {
  GitHubRepository,
  Prisma,
  User,
} from "@alfalfa/database/generated/client/index.js";
import { prisma } from "../prisma-client.js";

const AchievementDataInclude = {
  include: {
    userAchievements: {
      include: {
        achievement: true,
        userAchievementReason: {
          include: {
            githubRepository: {
              include: {
                githubOrganization: true,
              },
            },
          },
        },
      },
    },
    githubUser: {
      include: {
        githubUserCounts: {
          include: {
            githubRepository: {
              include: {
                githubOrganization: true,
              },
            },
          },
        },
      },
    },
  },
};

const userWithAchievementData = Prisma.validator<Prisma.UserArgs>()(
  AchievementDataInclude,
);
export type UserWithAchievementData = Prisma.UserGetPayload<
  typeof userWithAchievementData
>;

export async function findByGitHubUser(
  githubUser: GHUser,
  options?: {
    includeAchievementData?: false;
    includeDeleted?: boolean;
  },
): Promise<User>;
export async function findByGitHubUser(
  githubUser: GHUser,
  options: {
    includeAchievementData: true;
    includeDeleted?: boolean;
  },
): Promise<UserWithAchievementData>;
export async function findByGitHubUser(
  githubUser: GHUser,
  options: {
    includeAchievementData?: boolean;
    includeDeleted?: boolean;
  } = {
    includeAchievementData: false,
    includeDeleted: false,
  },
) {
  const includeAchievementData = options.includeAchievementData ?? false;

  return await prisma.user.findFirstOrThrow({
    where: {
      githubUser: {
        externalId: githubUser.id,
      },
      ...(!options.includeDeleted && {
        deletedAt: null,
      }),
    },
    ...(includeAchievementData && AchievementDataInclude),
  });
}

export async function findOrCreateByGitHubUser(
  githubUser: GHUser,
  repository: GitHubRepository,
  options?: {
    includeAchievementData?: false;
  },
): Promise<User>;
export async function findOrCreateByGitHubUser(
  githubUser: GHUser,
  repository: GitHubRepository,
  options: {
    includeAchievementData: true;
  },
): Promise<UserWithAchievementData>;
export async function findOrCreateByGitHubUser(
  githubUser: GHUser,
  repository: GitHubRepository,
  options: {
    includeAchievementData?: boolean;
  } = {
    includeAchievementData: false,
  },
) {
  const includeAchievementData = options.includeAchievementData ?? false;

  try {
    if (includeAchievementData) {
      return await findByGitHubUser(githubUser, { includeAchievementData });
    }
    if (!includeAchievementData) {
      return await findByGitHubUser(githubUser, { includeAchievementData });
    }
  } catch (error) {
    if (error instanceof Prisma.NotFoundError) {
      if (includeAchievementData) {
        return createUser(githubUser, repository, includeAchievementData);
      }
      if (!includeAchievementData) {
        return createUser(githubUser, repository, includeAchievementData);
      }
    }

    throw error;
  }
}

async function createUser(
  githubUser: GHUser,
  repository: GitHubRepository,
  includeAchievementData?: false,
): Promise<User>;
async function createUser(
  githubUser: GHUser,
  repository: GitHubRepository,
  includeAchievementData: true,
): Promise<UserWithAchievementData>;
async function createUser(
  githubUser: GHUser,
  repository: GitHubRepository,
  includeAchievementData = false,
) {
  return prisma.user.create({
    data: {
      organization: {
        connect: {
          id: repository.githubOrganizationId,
        },
      },
      githubUser: {
        create: {
          externalId: githubUser.id,
          login: githubUser.login,
          githubUserCounts: {
            create: {
              githubRepositoryId: repository.id,
            },
          },
        },
      },
    },
    ...(includeAchievementData && AchievementDataInclude),
  });
}

export async function deleteUser(user: User) {
  return prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      deletedAt: new Date(),
    },
  });
}

export async function unDeleteUser(user: User) {
  return prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      deletedAt: null,
    },
  });
}
