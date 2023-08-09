import { type EmitterWebhookEventName } from "@octokit/webhooks";
import { type Schema, type User } from "@octokit/webhooks-types";
import {
  Prisma,
  type Achievement,
} from "@alfalfa/database/generated/client/index.js";
import {
  findOrCreateByGitHubUser,
  type UserWithAchievementData,
} from "../data/user.js";
import { type WebhookOctokit } from "../types/webhook-octokit.js";

const githubRepositoryWithGitHubOrganization =
  Prisma.validator<Prisma.GitHubRepositoryArgs>()({
    include: {
      githubOrganization: true,
      gitHubRepositoryCounts: true,
    },
  });
export type GitHubRepositoryWithGitHubOrganization =
  Prisma.GitHubRepositoryGetPayload<
    typeof githubRepositoryWithGitHubOrganization
  >;

export abstract class BaseAchievement<TData extends Schema, TTransform> {
  abstract eventName: EmitterWebhookEventName;
  abstract webhookData: TData;

  achievement: Achievement;
  octokit: WebhookOctokit;
  repository: GitHubRepositoryWithGitHubOrganization;
  primaryUser: UserWithAchievementData | undefined;
  secondaryUsers: UserWithAchievementData[];

  constructor(
    achievement: Achievement,
    octokit: WebhookOctokit,
    repository: GitHubRepositoryWithGitHubOrganization,
  ) {
    this.achievement = achievement;
    this.octokit = octokit;
    this.repository = repository;

    this.secondaryUsers = [];
  }

  async qualify(): Promise<boolean> {
    await this.loadPrimaryUser();
    return this.checkQualification(await this.transform());
  }

  async loadPrimaryUser(): Promise<void> {
    this.primaryUser = await findOrCreateByGitHubUser(
      this.getPrimaryUser(),
      this.repository,
      {
        includeAchievementData: true,
      },
    );
  }

  getLoadedPrimaryUser(): UserWithAchievementData {
    if (!this.primaryUser) {
      throw Error("Primary user no loaded");
    }

    return this.primaryUser;
  }

  getLoadedSecondaryUsers(): UserWithAchievementData[] {
    return this.secondaryUsers;
  }

  getUsers(): UserWithAchievementData[] {
    return [this.getLoadedPrimaryUser(), ...this.getLoadedSecondaryUsers()];
  }

  async addSecondaryUser(user: User) {
    this.secondaryUsers.push(
      await findOrCreateByGitHubUser(user, this.repository, {
        includeAchievementData: true,
      }),
    );
  }

  protected abstract getPrimaryUser(): User;
  protected abstract checkQualification(data: TTransform): boolean;
  protected abstract transform(): Promise<TTransform>;
}
