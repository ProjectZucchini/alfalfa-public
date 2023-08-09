import {
  AchievementCard,
  findUserBySlackUserId,
  formatUserAchievement,
} from "@alfalfa/slack-lib";
import {
  AllMiddlewareArgs,
  BlockButtonAction,
  SlackActionMiddlewareArgs,
  SlackViewMiddlewareArgs,
  ViewSubmitAction,
} from "@slack/bolt";
import { CodedError, ErrorCode, WebAPIPlatformError } from "@slack/web-api";
import { findById } from "../../data/achievements.js";
import { CustomContext } from "../../index.js";
import { prisma } from "../../prisma-client.js";
import { AchievementShareModal } from "../ui/views/AchievementShareModal.js";

type HandleShareAchievementsButtonArgs =
  SlackActionMiddlewareArgs<BlockButtonAction> &
    AllMiddlewareArgs<CustomContext>;

export async function handleShareAchievementsButton({
  ack,
  body,
  client,
  logger,
}: HandleShareAchievementsButtonArgs) {
  await ack();

  const user = await findUserBySlackUserId(body.user.id);
  const userAchievement = await findById(user, parseInt(body.actions[0].value));
  const achievementCard = formatUserAchievement(userAchievement);

  try {
    await client.views.open({
      trigger_id: body.trigger_id,
      view: AchievementShareModal({
        achievementCard,
        slackUserId: body.user.id,
        userAchievementId: body.actions[0].value,
      }),
    });
  } catch (error) {
    logger.error(error);
  }
}

type HandleSubmitShareModalArgs = SlackViewMiddlewareArgs<ViewSubmitAction> &
  AllMiddlewareArgs<CustomContext>;

export async function handleSubmitShareModal({
  ack,
  body,
  client,
  payload,
  logger,
}: HandleSubmitShareModalArgs) {
  const channelId =
    payload.state.values["channel_select"]["channel_select"].selected_channel;

  if (!channelId) {
    await ack({
      response_action: "errors",
      errors: {
        channel_select: "Please choose a channel",
      },
    });
    return;
  }

  const user = await findUserBySlackUserId(body.user.id);
  const userAchievement = await findById(
    user,
    parseInt(JSON.parse(payload.private_metadata)["userAchievementId"]),
  );

  try {
    await client.chat.postMessage({
      channel: channelId,
      text: `:tada: Congrats :confetti_ball: to @${body.user.id} for earning a Sprout!`,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `:tada: Congrats :confetti_ball: to <@${body.user.id}> for earning a Sprout! :grinning_face_with_star_eyes:`,
          },
        },
        {
          type: "divider",
        },
        ...AchievementCard(formatUserAchievement(userAchievement)),
        {
          type: "divider",
        },
      ],
    });

    await prisma.slackShare.create({
      data: {
        channelId,
        slackUserId: user.slackUserId || -1,
        userAchievementId: userAchievement.id,
      },
    });
  } catch (error) {
    if (
      (error as CodedError).code === ErrorCode.PlatformError &&
      (error as WebAPIPlatformError).data.error === "not_in_channel"
    ) {
      await ack({
        response_action: "update",
        view: {
          type: "modal",
          title: {
            type: "plain_text",
            text: "Error",
          },
          blocks: [
            {
              type: "section",
              text: {
                type: "plain_text",
                text: "Sorry, we couldn't share your Sprout because the app isn't in the channel. Please add the app to the channel and try again.",
              },
            },
          ],
        },
      });
      return;
    }
    logger.error(error);
  }

  await ack();
}
