import { type PullRequestClosedEvent } from "@octokit/webhooks-types";
import { type Achievement } from "@alfalfa/database/generated/client/index.js";
import { type WebhookOctokit } from "../types/webhook-octokit.js";
import {
  BaseAchievement,
  type GitHubRepositoryWithGitHubOrganization,
} from "./base-achievement.js";

interface PrMoreDeletionsTransform {
  merged: boolean;
  additions: number;
  deletions: number;
}

export class PrMoreDeletions extends BaseAchievement<
  PullRequestClosedEvent,
  PrMoreDeletionsTransform
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

  async transform(): Promise<PrMoreDeletionsTransform> {
    if (this.eventName !== "pull_request.closed") {
      throw Error(`Webhook event name not supported: ${this.eventName}`);
    }

    return {
      merged: this.webhookData.pull_request.merged,
      additions: this.webhookData.pull_request.additions,
      deletions: this.webhookData.pull_request.deletions,
    };
  }

  checkQualification(additionsDeletions: PrMoreDeletionsTransform): boolean {
    return (
      additionsDeletions.merged &&
      additionsDeletions.deletions > additionsDeletions.additions &&
      additionsDeletions.additions > 0
    );
  }

  getPrimaryUser() {
    return this.webhookData.pull_request.user;
  }
}
