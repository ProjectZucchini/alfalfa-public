import { type PullRequestReviewSubmittedEvent } from "@octokit/webhooks-types";
import { type Achievement } from "@alfalfa/database/generated/client/index.js";
import { type WebhookOctokit } from "../../../types/webhook-octokit.js";
import { type GitHubRepositoryWithGitHubOrganization } from "../../base-achievement.js";
import { BasePersonalPrReviewed } from "./base-pr-reviewed.js";

export class MilestonePersonalPrReviewed1 extends BasePersonalPrReviewed {
  reviewThreshold = 1;

  constructor(
    achievement: Achievement,
    eventName: "pull_request_review.submitted",
    octokit: WebhookOctokit,
    repository: GitHubRepositoryWithGitHubOrganization,
    webhookData: PullRequestReviewSubmittedEvent,
  ) {
    super(achievement, eventName, octokit, repository, webhookData);
  }
}

export class MilestonePersonalPrReviewed10 extends BasePersonalPrReviewed {
  reviewThreshold = 10;

  constructor(
    achievement: Achievement,
    eventName: "pull_request_review.submitted",
    octokit: WebhookOctokit,
    repository: GitHubRepositoryWithGitHubOrganization,
    webhookData: PullRequestReviewSubmittedEvent,
  ) {
    super(achievement, eventName, octokit, repository, webhookData);
  }
}

export class MilestonePersonalPrReviewed25 extends BasePersonalPrReviewed {
  reviewThreshold = 25;

  constructor(
    achievement: Achievement,
    eventName: "pull_request_review.submitted",
    octokit: WebhookOctokit,
    repository: GitHubRepositoryWithGitHubOrganization,
    webhookData: PullRequestReviewSubmittedEvent,
  ) {
    super(achievement, eventName, octokit, repository, webhookData);
  }
}

export class MilestonePersonalPrReviewed50 extends BasePersonalPrReviewed {
  reviewThreshold = 50;

  constructor(
    achievement: Achievement,
    eventName: "pull_request_review.submitted",
    octokit: WebhookOctokit,
    repository: GitHubRepositoryWithGitHubOrganization,
    webhookData: PullRequestReviewSubmittedEvent,
  ) {
    super(achievement, eventName, octokit, repository, webhookData);
  }
}

export class MilestonePersonalPrReviewed100 extends BasePersonalPrReviewed {
  reviewThreshold = 100;

  constructor(
    achievement: Achievement,
    eventName: "pull_request_review.submitted",
    octokit: WebhookOctokit,
    repository: GitHubRepositoryWithGitHubOrganization,
    webhookData: PullRequestReviewSubmittedEvent,
  ) {
    super(achievement, eventName, octokit, repository, webhookData);
  }
}

export class MilestonePersonalPrReviewed200 extends BasePersonalPrReviewed {
  reviewThreshold = 200;

  constructor(
    achievement: Achievement,
    eventName: "pull_request_review.submitted",
    octokit: WebhookOctokit,
    repository: GitHubRepositoryWithGitHubOrganization,
    webhookData: PullRequestReviewSubmittedEvent,
  ) {
    super(achievement, eventName, octokit, repository, webhookData);
  }
}
