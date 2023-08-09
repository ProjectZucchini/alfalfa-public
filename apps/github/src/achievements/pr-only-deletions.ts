import { type PullRequestClosedEvent } from "@octokit/webhooks-types";
import { type Achievement } from "@alfalfa/database/generated/client/index.js";
import { type WebhookOctokit } from "../types/webhook-octokit.js";
import {
  BaseAchievement,
  type GitHubRepositoryWithGitHubOrganization,
} from "./base-achievement.js";

interface PrOnlyDeletionsTransform {
  merged: boolean;
  additions: number;
  deletions: number;
}

export class PrOnlyDeletions extends BaseAchievement<
  PullRequestClosedEvent,
  PrOnlyDeletionsTransform
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

  async transform(): Promise<PrOnlyDeletionsTransform> {
    if (this.eventName !== "pull_request.closed") {
      throw Error(`Webhook event name not supported: ${this.eventName}`);
    }

    return {
      merged: this.webhookData.pull_request.merged,
      additions: this.webhookData.pull_request.additions,
      deletions: this.webhookData.pull_request.deletions,
    };
  }

  checkQualification(additionsDeletions: PrOnlyDeletionsTransform): boolean {
    return (
      additionsDeletions.merged &&
      additionsDeletions.deletions > 0 &&
      additionsDeletions.additions === 0
    );
  }

  getPrimaryUser() {
    return this.webhookData.pull_request.user;
  }
}
