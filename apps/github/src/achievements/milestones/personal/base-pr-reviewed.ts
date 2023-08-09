import { type PullRequestReviewSubmittedEvent } from "@octokit/webhooks-types";
import {
  AchievementUserQualifyRestriction,
  type Achievement,
} from "@alfalfa/database/generated/client/index.js";
import { type WebhookOctokit } from "../../../types/webhook-octokit.js";
import {
  BaseAchievement,
  type GitHubRepositoryWithGitHubOrganization,
} from "../../base-achievement.js";

interface BasePersonalPrReviewedTransform {
  reviewedGlobal: number;
  reviewedOrg: number;
  reviewedRepo: number;
}

export class BasePersonalPrReviewed extends BaseAchievement<
  PullRequestReviewSubmittedEvent,
  BasePersonalPrReviewedTransform
> {
  eventName: "pull_request_review.submitted";
  webhookData: PullRequestReviewSubmittedEvent;
  reviewThreshold = -1;

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

  async transform(): Promise<BasePersonalPrReviewedTransform> {
    if (this.eventName !== "pull_request_review.submitted") {
      throw Error(`Webhook event name not supported: ${this.eventName}`);
    }

    if (!this.getLoadedPrimaryUser()) {
      throw new Error(
        "Unable to transform webhook payload. User was not properly loaded.",
      );
    }

    return {
      reviewedGlobal:
        this.getLoadedPrimaryUser().githubUser.githubUserCounts.reduce<number>(
          (prev, userCount) => prev + userCount.reviews,
          0,
        ),
      reviewedOrg:
        this.getLoadedPrimaryUser().githubUser.githubUserCounts.reduce<number>(
          (prev, userCount) => {
            if (
              userCount.githubRepository.githubOrganization.externalId ===
              this.webhookData.repository.owner.id
            ) {
              return prev + userCount.reviews;
            }
            return prev;
          },
          0,
        ),
      reviewedRepo:
        this.getLoadedPrimaryUser().githubUser.githubUserCounts.reduce<number>(
          (prev, userCount) => {
            if (
              userCount.githubRepository.githubOrganization.externalId ===
              this.webhookData.repository.owner.id
            ) {
              return prev + userCount.reviews;
            }
            return prev;
          },
          0,
        ),
    };
  }

  checkQualification(data: BasePersonalPrReviewedTransform): boolean {
    if (
      this.achievement.userQualifyRestriction ===
      AchievementUserQualifyRestriction.GLOBAL
    ) {
      return data.reviewedGlobal === this.reviewThreshold;
    }

    if (
      this.achievement.userQualifyRestriction ===
      AchievementUserQualifyRestriction.ORGANIZATION
    ) {
      return data.reviewedOrg === this.reviewThreshold;
    }

    if (
      this.achievement.userQualifyRestriction ===
      AchievementUserQualifyRestriction.REPOSITORY
    ) {
      return data.reviewedRepo === this.reviewThreshold;
    }

    throw new Error(
      `Unsupported UserQualifyRestriction: ${this.achievement.userQualifyRestriction}`,
    );
  }

  getPrimaryUser() {
    return this.webhookData.review.user;
  }
}
