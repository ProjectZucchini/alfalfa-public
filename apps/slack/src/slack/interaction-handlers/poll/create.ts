import { PollType } from "@alfalfa/database/generated/client/index.js";
import {
  AllMiddlewareArgs,
  SlackViewMiddlewareArgs,
  ViewSubmitAction,
} from "@slack/bolt";
import { CodedError, ErrorCode, WebAPIPlatformError } from "@slack/web-api";
import { CustomContext } from "../../../index.js";
import { prisma } from "../../../prisma-client.js";
import { findOrCreate } from "../../../data/slack-user.js";
import { getPollMessageBlocks } from "../../ui/lib/poll.js";

type HandleSubmitPollCreateModalArgs =
  SlackViewMiddlewareArgs<ViewSubmitAction> & AllMiddlewareArgs<CustomContext>;

export async function handleSubmitPollCreateModal({
  ack,
  body,
  client,
  logger,
  payload,
}: HandleSubmitPollCreateModalArgs) {
  if (!body.team) {
    throw new Error("Body is missing team");
  }

  const channelId =
    payload.state.values["channel_select"]["channel_select"]
      .selected_conversation;

  if (!channelId) {
    await ack({
      response_action: "errors",
      errors: {
        channel_select: "Please choose a channel",
      },
    });
    return;
  }

  const voteCount =
    payload.state.values["vote_count"]["vote_count"].selected_option?.value;

  if (voteCount !== "one" && voteCount !== "multiple") {
    await ack({
      response_action: "errors",
      errors: {
        channel_select: "Vote count value isn't correct.",
      },
    });
    return;
  }

  const slackUser = await findOrCreate(body.team.id, body.user.id);

  const optionsFields =
    payload.state.values["options"]["options"].selected_options || [];
  const anonymousVotes =
    optionsFields &&
    optionsFields.some((field) => field.value === "anonymous_votes");

  const poll = await prisma.poll.create({
    data: {
      channelId,
      topic: payload.state.values["topic"]["topic"].value || "",
      anonymousVotes,
      slackUserId: slackUser.id || -1,
      type: voteCount === "one" ? PollType.SINGLE_VOTE : PollType.MULTI_VOTE,
      pollOptions: {
        create: Object.keys(payload.state.values)
          .filter((key) => {
            const value = payload.state.values[key][key].value;

            return (
              key.startsWith("option_") && value && value.trim().length > 0
            );
          })
          .map((key) => ({
            option: payload.state.values[key][key].value || "",
          })),
      },
    },
    include: {
      pollOptions: {
        where: {
          deletedAt: {
            equals: null,
          },
        },
        orderBy: {
          id: "asc",
        },
        include: {
          pollVotes: {
            include: {
              slackUser: true,
            },
          },
        },
      },
      slackUser: true,
    },
  });

  try {
    await client.chat.postMessage({
      channel: channelId,
      blocks: getPollMessageBlocks(poll),
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
                text: "Sorry, we couldn't create the poll because the app isn't in the channel. Please add the app to the channel and try again.",
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
