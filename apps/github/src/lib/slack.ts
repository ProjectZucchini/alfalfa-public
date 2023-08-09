import {
  AchievementCard,
  formatUserAchievement,
  triggerAppHomeUpdate,
} from "@alfalfa/slack-lib";
import { SlackUser, User } from "@alfalfa/database/generated/client/index.js";
import { type Installation } from "@slack/oauth";
import { WebClient } from "@slack/web-api";
import { createAchievements } from "../data/achievement.js";
import { findBySlackUserId } from "../data/organization.js";
import { findByUser } from "../data/slack-user.js";
import { getWorkspaceBySlackUser } from "../data/slack-workspace.js";

async function getWebClient(slackUser: SlackUser) {
  const slackWorkspace = await getWorkspaceBySlackUser(slackUser);
  const slackInstallation =
    slackWorkspace.installation as unknown as Installation;

  if (!slackInstallation.bot) {
    throw Error("No bot token in the Slack installation");
  }

  return new WebClient(slackInstallation.bot.token);
}

export async function dmAchievements(
  userAchievements: Awaited<ReturnType<typeof createAchievements>>,
) {
  if (!userAchievements.length || !userAchievements[0].user.slackUser) {
    return;
  }

  const webClient = await getWebClient(userAchievements[0].user.slackUser);

  for (const userAchievement of userAchievements) {
    if (!userAchievement.user.slackUser) {
      continue;
    }

    await webClient.chat.postMessage({
      channel: userAchievement.user.slackUser.externalId,
      text: "Congrats! :tada: You earned Sprouts! :heart_eyes:",
      blocks: [
        {
          type: "section",
          text: {
            type: "plain_text",
            text: `Congrats! :tada: You earned ${
              userAchievements.length === 1 ? "a" : ""
            } Sprout${userAchievements.length === 1 ? "" : "s"}! :heart_eyes:`,
          },
        },
        ...AchievementCard(formatUserAchievement(userAchievement)),
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                text: ":mega: Share to a channel",
              },
              style: "primary",
              value: userAchievement.id.toString(),
              action_id: "messages:share",
            },
          ],
        },
        {
          type: "divider",
        },
      ],
    });
  }
}

export async function updateHomeScreen(user: User) {
  if (!user.slackUserId) {
    console.log(`No SlackUser associated with the User: ${user.id}`);
    return;
  }

  const slackUser = await findByUser(user);
  const webClient = await getWebClient(slackUser);
  const organization = await findBySlackUserId(slackUser.id);

  await triggerAppHomeUpdate(webClient, slackUser.externalId, organization);
}
