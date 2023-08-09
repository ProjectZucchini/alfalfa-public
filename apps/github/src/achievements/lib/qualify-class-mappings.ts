import {
  type IssuesOpenedEvent,
  type PullRequestOpenedEvent,
  type PullRequestClosedEvent,
  type PullRequestReviewSubmittedEvent,
} from "@octokit/webhooks-types";
import { Achievement } from "@alfalfa/database/generated/client/index.js";
import { type WebhookOctokit } from "../../types/webhook-octokit.js";
import {
  MilestonePersonalPrMerged5,
  MilestonePersonalPrMerged10,
  MilestonePersonalPrMerged25,
  MilestonePersonalPrMerged50,
  MilestonePersonalPrMerged100,
  MilestonePersonalPrMerged200,
} from "../milestones/personal/pr-merged.js";
import {
  MilestoneRepositoryPrMerged10,
  MilestoneRepositoryPrMerged25,
  MilestoneRepositoryPrMerged50,
  MilestoneRepositoryPrMerged100,
  MilestoneRepositoryPrMerged200,
  MilestoneRepositoryPrMerged300,
} from "../milestones/repository/pr-merged.js";
import {
  MilestonePersonalPrReviewed1,
  MilestonePersonalPrReviewed10,
  MilestonePersonalPrReviewed25,
  MilestonePersonalPrReviewed50,
  MilestonePersonalPrReviewed100,
  MilestonePersonalPrReviewed200,
} from "../milestones/personal/pr-reviewed.js";
import { type GitHubRepositoryWithGitHubOrganization } from "../base-achievement.js";
import { FirstIssue } from "../first-issue.js";
import { FirstPr } from "../first-pr.js";
import { FirstProjectPr } from "../first-project-pr.js";
import { Palindrome } from "../palindrome.js";
import { PrMergeNoApprovals } from "../pr-merge-no-approvals.js";
import { PrMoreDeletions } from "../pr-more-deletions.js";
import { PrMultipleContributors } from "../pr-multiple-contributors.js";
import { PrOneLiner } from "../pr-one-liner.js";
import { PrOnlyDeletions } from "../pr-only-deletions.js";
import { PrQuickReview } from "../pr-quick-review.js";
import { PrReceivedQuickReview } from "../pr-received-quick-review.js";
import { AchievementType } from "./achievement-type.js";
import { PrEqualLinesAddRemove } from "../pr-equal-lines-add-remove.js";
import { PrMergeByNotAuthor } from "../pr-merge-by-not-author.js";

export function getQualifyClass(
  achievement: Achievement,
  eventType:
    | "issues.opened"
    | "pull_request.opened"
    | "pull_request.closed"
    | "pull_request_review.submitted",
  repository: GitHubRepositoryWithGitHubOrganization,
  payload:
    | IssuesOpenedEvent
    | PullRequestOpenedEvent
    | PullRequestClosedEvent
    | PullRequestReviewSubmittedEvent,
  octokit: WebhookOctokit,
) {
  if (achievement.type === AchievementType.FIRST_ISSUE) {
    return new FirstIssue(
      achievement,
      eventType as "issues.opened",
      octokit,
      repository,
      payload as IssuesOpenedEvent,
    );
  }
  if (achievement.type === AchievementType.FIRST_PR) {
    return new FirstPr(
      achievement,
      eventType as "pull_request.opened",
      octokit,
      repository,
      payload as PullRequestOpenedEvent,
    );
  }
  if (achievement.type === AchievementType.PALINDROME) {
    return new Palindrome(
      achievement,
      eventType as "issues.opened" | "pull_request.opened",
      octokit,
      repository,
      payload as IssuesOpenedEvent | PullRequestOpenedEvent,
    );
  }
  if (achievement.type === AchievementType.PR_MORE_DELETIONS) {
    return new PrMoreDeletions(
      achievement,
      eventType as "pull_request.closed",
      octokit,
      repository,
      payload as PullRequestClosedEvent,
    );
  }
  if (achievement.type === AchievementType.PR_ONLY_DELETIONS) {
    return new PrOnlyDeletions(
      achievement,
      eventType as "pull_request.closed",
      octokit,
      repository,
      payload as PullRequestClosedEvent,
    );
  }
  if (achievement.type === AchievementType.FIRST_PROJECT_PR) {
    return new FirstProjectPr(
      achievement,
      eventType as "pull_request.closed",
      octokit,
      repository,
      payload as PullRequestClosedEvent,
    );
  }
  if (achievement.type === AchievementType.ONE_LINE_CHANGE) {
    return new PrOneLiner(
      achievement,
      eventType as "pull_request.closed",
      octokit,
      repository,
      payload as PullRequestClosedEvent,
    );
  }
  if (achievement.type === AchievementType.QUICK_PR_APPROVAL) {
    return new PrQuickReview(
      achievement,
      eventType as "pull_request_review.submitted",
      octokit,
      repository,
      payload as PullRequestReviewSubmittedEvent,
    );
  }
  if (achievement.type === AchievementType.RECEIVED_QUICK_PR_APPROVAL) {
    return new PrReceivedQuickReview(
      achievement,
      eventType as "pull_request_review.submitted",
      octokit,
      repository,
      payload as PullRequestReviewSubmittedEvent,
    );
  }
  if (achievement.type === AchievementType.PR_MERGE_NO_APPROVAL) {
    return new PrMergeNoApprovals(
      achievement,
      eventType as "pull_request.closed",
      octokit,
      repository,
      payload as PullRequestClosedEvent,
    );
  }
  if (achievement.type === AchievementType.MILESTONE_PERSONAL_PR_MERGED_5) {
    return new MilestonePersonalPrMerged5(
      achievement,
      eventType as "pull_request.closed",
      octokit,
      repository,
      payload as PullRequestClosedEvent,
    );
  }
  if (achievement.type === AchievementType.MILESTONE_PERSONAL_PR_MERGED_10) {
    return new MilestonePersonalPrMerged10(
      achievement,
      eventType as "pull_request.closed",
      octokit,
      repository,
      payload as PullRequestClosedEvent,
    );
  }
  if (achievement.type === AchievementType.MILESTONE_PERSONAL_PR_MERGED_25) {
    return new MilestonePersonalPrMerged25(
      achievement,
      eventType as "pull_request.closed",
      octokit,
      repository,
      payload as PullRequestClosedEvent,
    );
  }
  if (achievement.type === AchievementType.MILESTONE_PERSONAL_PR_MERGED_50) {
    return new MilestonePersonalPrMerged50(
      achievement,
      eventType as "pull_request.closed",
      octokit,
      repository,
      payload as PullRequestClosedEvent,
    );
  }
  if (achievement.type === AchievementType.MILESTONE_PERSONAL_PR_MERGED_100) {
    return new MilestonePersonalPrMerged100(
      achievement,
      eventType as "pull_request.closed",
      octokit,
      repository,
      payload as PullRequestClosedEvent,
    );
  }
  if (achievement.type === AchievementType.MILESTONE_PERSONAL_PR_MERGED_200) {
    return new MilestonePersonalPrMerged200(
      achievement,
      eventType as "pull_request.closed",
      octokit,
      repository,
      payload as PullRequestClosedEvent,
    );
  }
  if (achievement.type === AchievementType.MILESTONE_REPO_PR_MERGED_10) {
    return new MilestoneRepositoryPrMerged10(
      achievement,
      eventType as "pull_request.closed",
      octokit,
      repository,
      payload as PullRequestClosedEvent,
    );
  }
  if (achievement.type === AchievementType.MILESTONE_REPO_PR_MERGED_25) {
    return new MilestoneRepositoryPrMerged25(
      achievement,
      eventType as "pull_request.closed",
      octokit,
      repository,
      payload as PullRequestClosedEvent,
    );
  }
  if (achievement.type === AchievementType.MILESTONE_REPO_PR_MERGED_50) {
    return new MilestoneRepositoryPrMerged50(
      achievement,
      eventType as "pull_request.closed",
      octokit,
      repository,
      payload as PullRequestClosedEvent,
    );
  }
  if (achievement.type === AchievementType.MILESTONE_REPO_PR_MERGED_100) {
    return new MilestoneRepositoryPrMerged100(
      achievement,
      eventType as "pull_request.closed",
      octokit,
      repository,
      payload as PullRequestClosedEvent,
    );
  }
  if (achievement.type === AchievementType.MILESTONE_REPO_PR_MERGED_200) {
    return new MilestoneRepositoryPrMerged200(
      achievement,
      eventType as "pull_request.closed",
      octokit,
      repository,
      payload as PullRequestClosedEvent,
    );
  }
  if (achievement.type === AchievementType.MILESTONE_REPO_PR_MERGED_300) {
    return new MilestoneRepositoryPrMerged300(
      achievement,
      eventType as "pull_request.closed",
      octokit,
      repository,
      payload as PullRequestClosedEvent,
    );
  }
  if (achievement.type === AchievementType.PR_MERGE_EQUAL_LINES_ADDED_DELETED) {
    return new PrEqualLinesAddRemove(
      achievement,
      eventType as "pull_request.closed",
      octokit,
      repository,
      payload as PullRequestClosedEvent,
    );
  }
  if (achievement.type === AchievementType.PR_MERGE_BY_NOT_AUTHOR) {
    return new PrMergeByNotAuthor(
      achievement,
      eventType as "pull_request.closed",
      octokit,
      repository,
      payload as PullRequestClosedEvent,
    );
  }
  if (achievement.type === AchievementType.PR_MULTIPLE_CONTRIBUTORS) {
    return new PrMultipleContributors(
      achievement,
      eventType as "pull_request.closed",
      octokit,
      repository,
      payload as PullRequestClosedEvent,
    );
  }
  if (achievement.type === AchievementType.MILESTONE_PERSONAL_PR_REVIEWED_1) {
    return new MilestonePersonalPrReviewed1(
      achievement,
      eventType as "pull_request_review.submitted",
      octokit,
      repository,
      payload as PullRequestReviewSubmittedEvent,
    );
  }
  if (achievement.type === AchievementType.MILESTONE_PERSONAL_PR_REVIEWED_10) {
    return new MilestonePersonalPrReviewed10(
      achievement,
      eventType as "pull_request_review.submitted",
      octokit,
      repository,
      payload as PullRequestReviewSubmittedEvent,
    );
  }
  if (achievement.type === AchievementType.MILESTONE_PERSONAL_PR_REVIEWED_25) {
    return new MilestonePersonalPrReviewed25(
      achievement,
      eventType as "pull_request_review.submitted",
      octokit,
      repository,
      payload as PullRequestReviewSubmittedEvent,
    );
  }
  if (achievement.type === AchievementType.MILESTONE_PERSONAL_PR_REVIEWED_50) {
    return new MilestonePersonalPrReviewed50(
      achievement,
      eventType as "pull_request_review.submitted",
      octokit,
      repository,
      payload as PullRequestReviewSubmittedEvent,
    );
  }
  if (achievement.type === AchievementType.MILESTONE_PERSONAL_PR_REVIEWED_100) {
    return new MilestonePersonalPrReviewed100(
      achievement,
      eventType as "pull_request_review.submitted",
      octokit,
      repository,
      payload as PullRequestReviewSubmittedEvent,
    );
  }
  if (achievement.type === AchievementType.MILESTONE_PERSONAL_PR_REVIEWED_200) {
    return new MilestonePersonalPrReviewed200(
      achievement,
      eventType as "pull_request_review.submitted",
      octokit,
      repository,
      payload as PullRequestReviewSubmittedEvent,
    );
  }
  throw Error(
    `No qualification class defined for: ${
      AchievementType[achievement.type]
    } - ${eventType}`,
  );
}
