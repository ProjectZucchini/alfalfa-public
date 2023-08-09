import { type IssuesOpenedEvent } from "@octokit/webhooks-types";
import { qualifyAchievements } from "../lib/qualify-achievements.js";
import { updateUserCounts } from "../lib/user-counts.js";
import { type WebhookOctokit } from "../types/webhook-octokit.js";

export async function issuesOpened({
  octokit,
  payload,
}: {
  octokit: WebhookOctokit;
  payload: IssuesOpenedEvent;
}) {
  await updateUserCounts("issues.opened", payload.repository, payload.sender);
  await qualifyAchievements("issues.opened", octokit, payload);
}
