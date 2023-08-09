import { type PullRequestClosedEvent } from "@octokit/webhooks-types";
import { type Achievement } from "@alfalfa/database/generated/client/index.js";
import { type WebhookOctokit } from "../../../types/webhook-octokit.js";
import { type GitHubRepositoryWithGitHubOrganization } from "../../base-achievement.js";
import { BasePersonalPrMerged } from "./base-pr-merged.js";

export class MilestonePersonalPrMerged5 extends BasePersonalPrMerged {
  mergedCount = 5;

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

export class MilestonePersonalPrMerged10 extends BasePersonalPrMerged {
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

export class MilestonePersonalPrMerged25 extends BasePersonalPrMerged {
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

export class MilestonePersonalPrMerged50 extends BasePersonalPrMerged {
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

export class MilestonePersonalPrMerged100 extends BasePersonalPrMerged {
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

export class MilestonePersonalPrMerged200 extends BasePersonalPrMerged {
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
