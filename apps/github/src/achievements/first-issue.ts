import { type IssuesOpenedEvent } from "@octokit/webhooks-types";
import {
  AchievementUserQualifyRestriction,
  type Achievement,
} from "@alfalfa/database/generated/client/index.js";
import { type WebhookOctokit } from "../types/webhook-octokit.js";
import {
  BaseAchievement,
  type GitHubRepositoryWithGitHubOrganization,
} from "./base-achievement.js";

export class FirstIssue extends BaseAchievement<IssuesOpenedEvent, number> {
  eventName: "issues.opened";
  webhookData: IssuesOpenedEvent;

  constructor(
    achievement: Achievement,
    eventName: "issues.opened",
    octokit: WebhookOctokit,
    repository: GitHubRepositoryWithGitHubOrganization,
    webhookData: IssuesOpenedEvent,
  ) {
    super(achievement, octokit, repository);
    this.eventName = eventName;
    this.webhookData = webhookData;
  }

  async transform(): Promise<number> {
    if (this.eventName !== "issues.opened") {
      throw Error(`Webhook event name not supported: ${this.eventName}`);
    }

    if (!("githubUser" in this.getLoadedPrimaryUser())) {
      return 0;
    }

    if (
      this.achievement.userQualifyRestriction ===
      AchievementUserQualifyRestriction.GLOBAL
    ) {
      return this.getLoadedPrimaryUser().githubUser.githubUserCounts.reduce<number>(
        (prev, userCount) => prev + userCount.issues,
        0,
      );
    }

    if (
      this.achievement.userQualifyRestriction ===
      AchievementUserQualifyRestriction.ORGANIZATION
    ) {
      return this.getLoadedPrimaryUser().githubUser.githubUserCounts.reduce<number>(
        (prev, userCount) => {
          if (
            userCount.githubRepository.githubOrganization.externalId ===
            this.webhookData.repository.owner.id
          ) {
            return prev + userCount.issues;
          }
          return prev;
        },
        0,
      );
    }

    if (
      this.achievement.userQualifyRestriction ===
      AchievementUserQualifyRestriction.REPOSITORY
    ) {
      return this.getLoadedPrimaryUser().githubUser.githubUserCounts.reduce<number>(
        (prev, userCount) => {
          if (
            userCount.githubRepository.externalId ===
            this.webhookData.repository.id
          ) {
            return prev + userCount.issues;
          }
          return prev;
        },
        0,
      );
    }

    throw Error(
      `Unknown user qualification restriction: ${this.achievement.userQualifyRestriction}`,
    );
  }

  checkQualification(issueCount: number): boolean {
    return issueCount === 1;
  }

  getPrimaryUser() {
    return this.webhookData.issue.user;
  }
}
