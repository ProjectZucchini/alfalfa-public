import { PullRequestClosedEvent, User } from "@octokit/webhooks-types";
import {
  BaseAchievement,
  GitHubRepositoryWithGitHubOrganization,
} from "./base-achievement";
import { Achievement } from "@alfalfa/database/generated/client";
import { WebhookOctokit } from "../types/webhook-octokit";

interface MergedByNotAuthorTransform {
  merged: boolean;
  author: User;
  mergedBy: User | null;
}

export class PrMergeByNotAuthor extends BaseAchievement<
  PullRequestClosedEvent,
  MergedByNotAuthorTransform
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

  checkQualification(data: MergedByNotAuthorTransform): boolean {
    return data.merged && data.author.id !== data.mergedBy?.id;
  }

  async transform(): Promise<MergedByNotAuthorTransform> {
    if (this.eventName !== "pull_request.closed") {
      throw Error(`Webhook event name not supported: ${this.eventName}`);
    }

    return {
      merged: this.webhookData.pull_request.merged,
      author: this.webhookData.pull_request.user,
      mergedBy: this.webhookData.pull_request.merged_by,
    };
  }

  getPrimaryUser() {
    if (!this.webhookData.pull_request.merged_by) {
      throw new Error(
        `Unable to load user for PrMergeByNotAuthor achievement. Webhook's merged_by property is null.`,
      );
    }

    return this.webhookData.pull_request.merged_by;
  }
}
