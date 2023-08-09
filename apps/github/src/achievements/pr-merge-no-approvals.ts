import { type PullRequestClosedEvent } from "@octokit/webhooks-types";
import { type Achievement } from "@alfalfa/database/generated/client/index.js";
import { type WebhookOctokit } from "../types/webhook-octokit.js";
import {
  BaseAchievement,
  type GitHubRepositoryWithGitHubOrganization,
} from "./base-achievement.js";

interface PrMergeNoApprovalsTransform {
  merged: boolean;
  numApprovals: number;
  requesterUserId: number;
  mergerUserId: number | undefined;
}

export class PrMergeNoApprovals extends BaseAchievement<
  PullRequestClosedEvent,
  PrMergeNoApprovalsTransform
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

  async transform(): Promise<PrMergeNoApprovalsTransform> {
    if (this.eventName !== "pull_request.closed") {
      throw Error(`Webhook event name not supported: ${this.eventName}`);
    }

    const { data: reviews } = await this.octokit.rest.pulls.listReviews({
      owner: this.webhookData.repository.owner.login,
      repo: this.webhookData.repository.name,
      pull_number: this.webhookData.pull_request.number,
    });

    return {
      merged:
        this.getLoadedPrimaryUser() && this.webhookData.pull_request.merged,
      numApprovals: reviews.filter((review) => {
        if (!review.submitted_at || !this.webhookData.pull_request.merged_at) {
          return false;
        }

        const mergedDate = new Date(this.webhookData.pull_request.merged_at);
        const reviewedDate = new Date(review.submitted_at);
        return review.state === "APPROVED" && mergedDate > reviewedDate;
      }).length,
      requesterUserId: this.webhookData.pull_request.user.id,
      mergerUserId: this.webhookData.pull_request.merged_by?.id,
    };
  }

  checkQualification(transform: PrMergeNoApprovalsTransform): boolean {
    return (
      transform.merged &&
      transform.numApprovals === 0 &&
      transform.requesterUserId === transform.mergerUserId
    );
  }

  getPrimaryUser() {
    return this.webhookData.pull_request.user;
  }
}
