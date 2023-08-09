import { type PullRequestClosedEvent } from "@octokit/webhooks-types";
import { type Achievement } from "@alfalfa/database/generated/client/index.js";
import { type WebhookOctokit } from "../../../types/webhook-octokit.js";
import { type GitHubRepositoryWithGitHubOrganization } from "../../base-achievement.js";
import { BaseRepositoryPrMerged } from "./base-pr-merged.js";

export class MilestoneRepositoryPrMerged10 extends BaseRepositoryPrMerged {
  mergedCount = 10;

  constructor(
    achievement: Achievement,
    eventName: "pull_request.closed",
    octokit: WebhookOctokit,
    repository: GitHubRepositoryWithGitHubOrganization,
    webhookData: PullRequestClosedEvent,
  ) {
    super(achievement, eventName, octokit, repository, webhookData);
  }
}

export class MilestoneRepositoryPrMerged25 extends BaseRepositoryPrMerged {
  mergedCount = 25;

  constructor(
    achievement: Achievement,
    eventName: "pull_request.closed",
    octokit: WebhookOctokit,
    repository: GitHubRepositoryWithGitHubOrganization,
    webhookData: PullRequestClosedEvent,
  ) {
    super(achievement, eventName, octokit, repository, webhookData);
  }
}

export class MilestoneRepositoryPrMerged50 extends BaseRepositoryPrMerged {
  mergedCount = 50;

  constructor(
    achievement: Achievement,
    eventName: "pull_request.closed",
    octokit: WebhookOctokit,
    repository: GitHubRepositoryWithGitHubOrganization,
    webhookData: PullRequestClosedEvent,
  ) {
    super(achievement, eventName, octokit, repository, webhookData);
  }
}

export class MilestoneRepositoryPrMerged100 extends BaseRepositoryPrMerged {
  mergedCount = 100;

  constructor(
    achievement: Achievement,
    eventName: "pull_request.closed",
    octokit: WebhookOctokit,
    repository: GitHubRepositoryWithGitHubOrganization,
    webhookData: PullRequestClosedEvent,
  ) {
    super(achievement, eventName, octokit, repository, webhookData);
  }
}

export class MilestoneRepositoryPrMerged200 extends BaseRepositoryPrMerged {
  mergedCount = 200;

  constructor(
    achievement: Achievement,
    eventName: "pull_request.closed",
    octokit: WebhookOctokit,
    repository: GitHubRepositoryWithGitHubOrganization,
    webhookData: PullRequestClosedEvent,
  ) {
    super(achievement, eventName, octokit, repository, webhookData);
  }
}

export class MilestoneRepositoryPrMerged300 extends BaseRepositoryPrMerged {
  mergedCount = 300;

  constructor(
    achievement: Achievement,
    eventName: "pull_request.closed",
    octokit: WebhookOctokit,
    repository: GitHubRepositoryWithGitHubOrganization,
    webhookData: PullRequestClosedEvent,
  ) {
    super(achievement, eventName, octokit, repository, webhookData);
  }
}
