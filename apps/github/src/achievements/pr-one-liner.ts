import { type PullRequestClosedEvent } from "@octokit/webhooks-types";
import { type Achievement } from "@alfalfa/database/generated/client/index.js";
import { type WebhookOctokit } from "../types/webhook-octokit.js";
import {
  BaseAchievement,
  type GitHubRepositoryWithGitHubOrganization,
} from "./base-achievement.js";

interface PrOneLinerTransform {
  merged: boolean;
  additions: number;
  deletions: number;
}

export class PrOneLiner extends BaseAchievement<
  PullRequestClosedEvent,
  PrOneLinerTransform
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

  async transform(): Promise<PrOneLinerTransform> {
    if (this.eventName !== "pull_request.closed") {
      throw Error(`Webhook event name not supported: ${this.eventName}`);
    }

    return {
      merged: this.webhookData.pull_request.merged,
      additions: this.webhookData.pull_request.additions,
      deletions: this.webhookData.pull_request.deletions,
    };
  }

  checkQualification(additionsDeletions: PrOneLinerTransform): boolean {
    if (!additionsDeletions.merged) {
      return false;
    }

    if (
      additionsDeletions.additions === 0 &&
      additionsDeletions.deletions === 0
    ) {
      return false;
    }

    return !(
      additionsDeletions.additions > 1 || additionsDeletions.deletions > 1
    );
  }

  getPrimaryUser() {
    return this.webhookData.pull_request.user;
  }
}
