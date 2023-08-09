import {
  type IssuesOpenedEvent,
  type PullRequestOpenedEvent,
  type PullRequestClosedEvent,
  type PullRequestReviewSubmittedEvent,
} from "@octokit/webhooks-types";
import {
  type Achievement,
  type User,
} from "@alfalfa/database/generated/client/index.js";
import { getQualifyClass } from "../achievements/lib/qualify-class-mappings.js";
import { findByEventName } from "../data/achievement.js";
import { getOrCreateByRepository } from "../data/github-repository.js";
import { type WebhookOctokit } from "../types/webhook-octokit.js";
import {
  grantAchievements,
  hasUserReceivedAchievement,
} from "./achievements.js";

type EventName = "issues" | "pull_request";

export async function qualifyAchievements(
  eventType:
    | "issues.opened"
    | "pull_request.opened"
    | "pull_request.closed"
    | "pull_request_review.submitted",
  octokit: WebhookOctokit,
  payload:
    | IssuesOpenedEvent
    | PullRequestOpenedEvent
    | PullRequestClosedEvent
    | PullRequestReviewSubmittedEvent,
) {
  if (!payload.installation?.id) {
    return;
  }

  const achievements = await findByEventName(eventType, false);
  const repository = await getOrCreateByRepository(
    payload.repository,
    payload.repository.owner,
  );

  const qualifiedAchievements: {
    users: User[];
    achievement: Achievement;
  }[] = [];
  for (const achievement of achievements) {
    const achievementClass = getQualifyClass(
      achievement,
      eventType,
      repository,
      payload,
      octokit,
    );

    if (!(await achievementClass.qualify())) {
      continue;
    }

    // Check to see if any of the users have already received this achievement
    const usersToReceiveAchievement = achievementClass
      .getUsers()
      .filter(
        (user) => !hasUserReceivedAchievement(user, achievement, repository),
      );

    if (usersToReceiveAchievement.length > 0) {
      qualifiedAchievements.push({
        users: usersToReceiveAchievement,
        achievement,
      });
    }
  }

  const eventName = eventType.split(".")[0] as EventName;
  await grantAchievements(qualifiedAchievements, eventName, payload);

  console.log(
    "Earned Achievements",
    qualifiedAchievements.map(
      (qualifiedAchievement) => qualifiedAchievement.achievement.name,
    ),
  );
}
