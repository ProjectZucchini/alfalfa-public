import { Poll, Prisma } from "@alfalfa/database/generated/client/index.js";
import {
  type AllMiddlewareArgs,
  type BlockOverflowAction,
  type Logger,
  type SlackActionMiddlewareArgs,
  type View,
} from "@slack/bolt";
import { type WebClient } from "@slack/web-api";
import { CustomContext } from "../../../index.js";
import { prisma } from "../../../prisma-client.js";
import { getOptionEmoji } from "../../ui/lib/poll.js";
import { showBasicModal } from "../../ui/views/modal/basic-modal.js";
import { showError } from "../../ui/views/error-modal.js";

type HandlePollOptionsButtonArgs =
  SlackActionMiddlewareArgs<BlockOverflowAction> &
    AllMiddlewareArgs<CustomContext>;

export async function handlePollOptionsButton({
  ack,
  body,
  client,
  logger,
  payload,
}: HandlePollOptionsButtonArgs) {
  const selectedOption: {
    option: "delete" | "edit" | "close";
    pollId: number;
  } = JSON.parse(payload.selected_option.value);

  const poll = await prisma.poll.findUniqueOrThrow({
    where: {
      id: selectedOption.pollId,
    },
    include: {
      slackUser: true,
    },
  });

  if (selectedOption.option === "edit") {
    await handleEditOption(body, client, logger, poll);
  } else if (selectedOption.option === "close") {
    await handleCloseOption(body, client, logger, poll);
  } else if (selectedOption.option === "delete") {
    await handleDeleteOption(body, client, logger, poll);
  }

  await ack();
}

async function handleEditOption(
  body: BlockOverflowAction,
  client: WebClient,
  logger: Logger,
  poll: Prisma.PollGetPayload<{
    include: {
      slackUser: true;
    };
  }>,
) {
  if (!body.message) {
    throw new Error("Body is missing message.");
  }

  const pollOptions = await prisma.pollOption.findMany({
    where: {
      pollId: poll.id,
      deletedAt: {
        equals: null,
      },
    },
    include: {
      _count: {
        select: { pollVotes: true },
      },
    },
  });

  try {
    if (body.user.id === poll.slackUser.externalId) {
      await client.views.open({
        type: "modal",
        trigger_id: body.trigger_id,
        view: getEditModalView(body.message.ts, poll, pollOptions),
      });
    } else {
      await showError(
        "Only the creator can close this poll.",
        client,
        body.trigger_id,
      );
    }
  } catch (error) {
    logger.error(error);
  }
}

export function getEditModalView(
  messageTs: string,
  poll: Poll,
  pollOptions: Prisma.PollOptionGetPayload<{
    include: {
      _count: {
        select: { pollVotes: true };
      };
    };
  }>[],
): View {
  return {
    type: "modal",
    private_metadata: JSON.stringify({
      pollId: poll.id,
      messageTs: messageTs,
    }),
    close: {
      type: "plain_text",
      text: "Close",
    },
    title: {
      type: "plain_text",
      text: "Edit Poll",
    },
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*Topic*",
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `${poll.topic}`,
        },
        accessory: {
          type: "button",
          text: {
            type: "plain_text",
            text: `Edit Topic`,
          },
          action_id: "poll:edit:topic",
          value: JSON.stringify({
            pollId: poll.id,
            messageTs: messageTs,
          }),
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*Options*",
        },
      },
      ...pollOptions.map((option, idx) => {
        const numVotes = option._count.pollVotes;

        return {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `${getOptionEmoji(idx)} *${option.option}* _(${numVotes} ${
              numVotes === 1 ? "vote" : "votes"
            })_`,
          },
          accessory: {
            type: "button",
            style: "danger",
            text: {
              type: "plain_text",
              text: `${getOptionEmoji(idx)} Delete`,
            },
            action_id: "poll:edit:option:delete",
            value: JSON.stringify({
              pollOptionId: option.id,
              messageTs: messageTs,
            }),
            confirm: {
              title: {
                type: "plain_text",
                text: "Delete option?",
              },
              text: {
                type: "mrkdwn",
                text: `Are you sure you want to delete option ${getOptionEmoji(
                  idx,
                )}${
                  numVotes > 0
                    ? ` and *${numVotes}* ${numVotes === 1 ? "vote" : "votes"}`
                    : ""
                }?`,
              },
              confirm: {
                type: "plain_text",
                text: "Delete",
              },
              deny: {
                type: "plain_text",
                text: "Cancel",
              },
            },
          },
        };
      }),
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: `Add Option`,
            },
            action_id: "poll:edit:option:add",
            value: JSON.stringify({
              pollId: poll.id,
              messageTs: messageTs,
            }),
          },
        ],
      },
    ],
  };
}

async function handleCloseOption(
  body: BlockOverflowAction,
  client: WebClient,
  logger: Logger,
  poll: Prisma.PollGetPayload<{
    include: {
      slackUser: true;
    };
  }>,
) {
  if (!body.message) {
    throw new Error("Body is missing message.");
  }

  try {
    if (body.user.id === poll.slackUser.externalId) {
      await showBasicModal({
        client,
        triggerId: body.trigger_id,
        callBackId: "poll:close",
        title: "Close Poll",
        message:
          "Are you sure you want to close this poll? It will close the poll and prevent further voting.",
        metadata: JSON.stringify({
          pollId: poll.id,
          messageTs: body.message.ts,
        }),
        submitButtonText: "Confirm",
      });
    } else {
      await showError(
        "Only the creator can close this poll.",
        client,
        body.trigger_id,
      );
    }
  } catch (error) {
    logger.error(error);
  }
}

async function handleDeleteOption(
  body: BlockOverflowAction,
  client: WebClient,
  logger: Logger,
  poll: Prisma.PollGetPayload<{
    include: {
      slackUser: true;
    };
  }>,
) {
  if (!body.message) {
    throw new Error("Body is missing message.");
  }

  try {
    if (body.user.id === poll.slackUser.externalId) {
      await showBasicModal({
        client,
        triggerId: body.trigger_id,
        callBackId: "poll:delete",
        title: "Delete Poll",
        message:
          "Are you sure you want to delete this poll? It will remove the poll from the channel.",
        metadata: JSON.stringify({
          pollId: poll.id,
          messageTs: body.message.ts,
        }),
        submitButtonText: "Confirm",
      });
    } else {
      await showError(
        "Only the creator can delete this poll.",
        client,
        body.trigger_id,
      );
    }
  } catch (error) {
    logger.error(error);
  }
}
