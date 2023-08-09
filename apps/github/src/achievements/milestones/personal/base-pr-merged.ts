import { type PullRequestClosedEvent } from "@octokit/webhooks-types";
import { type Achievement } from "@alfalfa/database/generated/client/index.js";
import { type WebhookOctokit } from "../../../types/webhook-octokit.js";
import {
  BaseAchievement,
  type GitHubRepositoryWithGitHubOrganization,
} from "../../base-achievement.js";

interface BasePersonalPrMergedTransform {
  merged: boolean;
  mergedCount: number;
}

export class BasePersonalPrMerged extends BaseAchievement<
  PullRequestClosedEvent,
  BasePersonalPrMergedTransform
> {
  eventName: "pull_request.closed";
  webhookData: PullRequestClosedEvent;
  mergedCount = -1;

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

  async transform(): Promise<BasePersonalPrMergedTransform> {
    if (this.eventName !== "pull_request.closed") {
      throw Error(`Webhook event name not supported: ${this.eventName}`);
    }

    let mergedCount = 0;
    // If the PR hasn't been merged yet, don't even bother adding up the total number of
    // merged PRs the user has
    if (this.webhookData.pull_request.merged) {
      mergedCount =
        this.getLoadedPrimaryUser()?.githubUser.githubUserCounts.reduce<number>(
          (prev, userCount) => prev + userCount.pullRequestsMerged,
          0,
        ) || 0;
    }

    return {
      merged: this.webhookData.pull_request.merged,
      mergedCount,
    };
  }

  checkQualification(mergeInfo: BasePersonalPrMergedTransform): boolean {
    return mergeInfo.merged && mergeInfo.mergedCount === this.mergedCount;
  }

  getPrimaryUser() {
    return this.webhookData.pull_request.user;
  }
}
