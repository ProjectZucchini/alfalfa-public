import {
  type PullRequestClosedEvent,
  type PullRequestOpenedEvent,
} from "@octokit/webhooks-types";
import { updateGitHubRepositoryCounts } from "../lib/github-repository-counts.js";
import { qualifyAchievements } from "../lib/qualify-achievements.js";
import { updateUserCounts } from "../lib/user-counts.js";
import { type WebhookOctokit } from "../types/webhook-octokit.js";

export async function pullRequestClosed({
  octokit,
  payload,
}: {
  octokit: WebhookOctokit;
  payload: PullRequestClosedEvent;
}) {
  // Ignore draft PRs
  if (payload.pull_request.draft) {
    return;
  }

  // If the PR was merged, increase the count of the PR creator
  if (payload.pull_request.merged) {
    await updateUserCounts(
      "pull_request.merged",
      payload.repository,
      payload.pull_request.user,
    );
    await updateGitHubRepositoryCounts(
      "pull_request.merged",
      payload.repository,
    );
  }
  await qualifyAchievements("pull_request.closed", octokit, payload);
}

export async function pullRequestOpened({
  octokit,
  payload,
}: {
  octokit: WebhookOctokit;
  payload: PullRequestOpenedEvent;
}) {
  // Ignore draft PRs
  if (payload.pull_request.draft) {
    return;
  }

  await updateUserCounts(
    "pull_request.opened",
    payload.repository,
    payload.sender,
  );
  await qualifyAchievements("pull_request.opened", octokit, payload);
}
