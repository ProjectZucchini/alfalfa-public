import { type PullRequestClosedEvent } from "@octokit/webhooks-types";
import { type Achievement } from "@alfalfa/database/generated/client/index.js";
import { prisma } from "../prisma-client.js";
import { type WebhookOctokit } from "../types/webhook-octokit.js";
import { AchievementType } from "./lib/achievement-type.js";
import {
  BaseAchievement,
  type GitHubRepositoryWithGitHubOrganization,
} from "./base-achievement.js";

export class FirstProjectPr extends BaseAchievement<
  PullRequestClosedEvent,
  boolean
> {
  eventName: "pull_request.closed";
  webhookData: PullRequestClosedEvent;

  constructor(
    achievement: Achievement,
    eventName: "pull_request.closed",
    octokit: WebhookOctokit,
    repository: GitHubRepositoryWithGitHubOrganization,
    webhookData: PullRequestClosedEvent,
  ) {
    super(achievement, octokit, repository);
    this.eventName = eventName;
    this.webhookData = webhookData;
  }

  async transform(): Promise<boolean> {
    if (this.eventName !== "pull_request.closed") {
      throw Error(`Webhook event name not supported: ${this.eventName}`);
    }

    const achievementAlreadyIssued = await prisma.userAchievement.findFirst({
      where: {
        achievement: {
          type: AchievementType.FIRST_PROJECT_PR,
        },
        userAchievementReason: {
          githubRepositoryId: this.repository.id,
        },
      },
    });

    if (achievementAlreadyIssued) {
      return true;
    }

    const { data: pulls } = await this.octokit.rest.pulls.list({
      owner: this.webhookData.repository.owner.login,
      repo: this.webhookData.repository.name,
      state: "closed",
      sort: "updated",
      direction: "asc",
    });

    return (
      pulls.filter((pull) => {
        return pull.merged_at;
      }).length > 0
    );
  }

  checkQualification(hasMergedAchievements: boolean): boolean {
    return !hasMergedAchievements;
  }

  getPrimaryUser() {
    return this.webhookData.pull_request.user;
  }
}
