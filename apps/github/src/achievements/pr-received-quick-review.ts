import { type PullRequestReviewSubmittedEvent } from "@octokit/webhooks-types";
import { type Achievement } from "@alfalfa/database/generated/client/index.js";
import { type WebhookOctokit } from "../types/webhook-octokit.js";
import {
  BaseAchievement,
  type GitHubRepositoryWithGitHubOrganization,
} from "./base-achievement.js";

const APPROVAL_INTERVAL = 60000; // 1 minute

export class PrReceivedQuickReview extends BaseAchievement<
  PullRequestReviewSubmittedEvent,
  number
> {
  eventName: "pull_request_review.submitted";
  webhookData: PullRequestReviewSubmittedEvent;

  constructor(
    achievement: Achievement,
    eventName: "pull_request_review.submitted",
    octokit: WebhookOctokit,
    repository: GitHubRepositoryWithGitHubOrganization,
    webhookData: PullRequestReviewSubmittedEvent,
  ) {
    super(achievement, octokit, repository);
    this.eventName = eventName;
    this.webhookData = webhookData;
  }

  async transform(): Promise<number> {
    if (this.eventName !== "pull_request_review.submitted") {
      throw Error(`Webhook event name not supported: ${this.eventName}`);
    }

    if (!this.webhookData.review.submitted_at) {
      return 600000;
    }

    const createdAt = new Date(this.webhookData.pull_request.created_at);
    const submittedAt = new Date(this.webhookData.review.submitted_at);

    return submittedAt.getTime() - createdAt.getTime();
  }

  checkQualification(timeElapsed: number): boolean {
    return timeElapsed < APPROVAL_INTERVAL;
  }

  getPrimaryUser() {
    return this.webhookData.pull_request.user;
  }
}
