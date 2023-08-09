import { PullRequestClosedEvent } from "@octokit/webhooks-types";
import {
  BaseAchievement,
  GitHubRepositoryWithGitHubOrganization,
} from "./base-achievement";
import { Achievement } from "@alfalfa/database/generated/client";
import { WebhookOctokit } from "../types/webhook-octokit";

interface EqualLinesAddRemoveTransform {
  merged: boolean;
  linesAdded: number;
  linesRemoved: number;
}

export class PrEqualLinesAddRemove extends BaseAchievement<
  PullRequestClosedEvent,
  EqualLinesAddRemoveTransform
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

  checkQualification(data: EqualLinesAddRemoveTransform): boolean {
    return (
      data.linesAdded > 0 &&
      data.linesAdded === data.linesRemoved &&
      data.merged
    );
  }

  async transform(): Promise<EqualLinesAddRemoveTransform> {
    if (this.eventName !== "pull_request.closed") {
      throw Error(`Webhook event name not supported: ${this.eventName}`);
    }

    return {
      merged: this.webhookData.pull_request.merged,
      linesAdded: this.webhookData.pull_request.additions,
      linesRemoved: this.webhookData.pull_request.deletions,
    };
  }

  getPrimaryUser() {
    return this.webhookData.pull_request.user;
  }
}
