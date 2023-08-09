import { type PullRequestReviewSubmittedEvent } from "@octokit/webhooks-types";
import { qualifyAchievements } from "../lib/qualify-achievements.js";
import { updateUserCounts } from "../lib/user-counts.js";
import { type WebhookOctokit } from "../types/webhook-octokit.js";

export async function pullRequestReviewSubmitted({
  octokit,
  payload,
}: {
  octokit: WebhookOctokit;
  payload: PullRequestReviewSubmittedEvent;
}) {
  await updateUserCounts(
    "pull_request_review.submitted",
    payload.repository,
    payload.sender,
  );
  await qualifyAchievements("pull_request_review.submitted", octokit, payload);
}
