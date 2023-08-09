import {
  type AllMiddlewareArgs,
  type BlockButtonAction,
  type Logger,
  type SlackActionMiddlewareArgs,
  type SlackViewMiddlewareArgs,
  type ViewSubmitAction,
} from "@slack/bolt";
import { WebClient } from "@slack/web-api";
import { CustomContext } from "../../../index.js";
import { prisma } from "../../../prisma-client.js";
import { getPollMessageBlocks } from "../../ui/lib/poll.js";
import { getEditModalView } from "./options.js";

type HandleBlockButtonActionArgs =
  SlackActionMiddlewareArgs<BlockButtonAction> &
    AllMiddlewareArgs<CustomContext>;

type HandleViewSubmitActionArgs = SlackViewMiddlewareArgs<ViewSubmitAction> &
  AllMiddlewareArgs<CustomContext>;

export async function handlePollEditAddOptionButton({
  ack,
  body,
  client,
  logger,
  payload,
}: HandleBlockButtonActionArgs) {
  if (!body.view) {
    throw new Error("Body is missing view");
  }

  const payloadValue: {
    pollId: number;
    messageTs: string;
  } = JSON.parse(payload.value);

  const poll = await prisma.poll.findUniqueOrThrow({
    where: {
      id: payloadValue.pollId,
    },
  });

  try {
    client.views.push({
      trigger_id: body.trigger_id,
      view: {
        type: "modal",
        callback_id: "poll:edit:option:add",
        private_metadata: JSON.stringify({
          pollId: poll.id,
          messageTs: payloadValue.messageTs,
        }),
        close: {
          type: "plain_text",
          text: "Close",
        },
        submit: {
          type: "plain_text",
          text: "Add",
        },
        title: {
          type: "plain_text",
          text: "Add Option",
        },
        blocks: [
          {
            type: "input",
            block_id: "option",
            element: {
              type: "plain_text_input",
              action_id: "option",
              placeholder: {
                type: "plain_text",
                text: "New option",
              },
            },
            label: {
              type: "plain_text",
              text: "Option",
            },
          },
        ],
      },
    });
  } catch (error) {
    logger.error(error);
  }

  await ack();
}

export async function handlePollEditDeleteOptionButton({
  ack,
  body,
  client,
  logger,
  payload,
}: HandleBlockButtonActionArgs) {
  if (!body.view) {
    throw new Error("Body is missing view");
  }

  const payloadValue: {
    pollOptionId: number;
    messageTs: string;
  } = JSON.parse(payload.value);

  const pollOption = await prisma.pollOption.update({
    where: {
      id: payloadValue.pollOptionId,
    },
    data: {
      deletedAt: new Date(),
    },
  });

  await refreshModalMessage(
    client,
    logger,
    body.view.id,
    payloadValue.messageTs,
    pollOption.pollId,
  );

  await ack();
}

export async function handlePollEditTopicButton({
  ack,
  body,
  client,
  logger,
  payload,
}: HandleBlockButtonActionArgs) {
  if (!body.view) {
    throw new Error("Body is missing view");
  }

  const payloadValue: {
    pollId: number;
    messageTs: string;
  } = JSON.parse(payload.value);

  const poll = await prisma.poll.findUniqueOrThrow({
    where: {
      id: payloadValue.pollId,
    },
  });

  try {
    client.views.push({
      trigger_id: body.trigger_id,
      view: {
        type: "modal",
        callback_id: "poll:edit:topic",
        private_metadata: JSON.stringify({
          pollId: poll.id,
          messageTs: payloadValue.messageTs,
        }),
        close: {
          type: "plain_text",
          text: "Close",
        },
        submit: {
          type: "plain_text",
          text: "Save",
        },
        title: {
          type: "plain_text",
          text: "Edit Topic",
        },
        blocks: [
          {
            type: "input",
            block_id: "topic",
            element: {
              type: "plain_text_input",
              action_id: "topic",
              initial_value: poll.topic,
              placeholder: {
                type: "plain_text",
                text: "Poll topic",
              },
            },
            label: {
              type: "plain_text",
              text: "Poll Topic",
            },
          },
        ],
      },
    });
  } catch (error) {
    logger.error(error);
  }

  await ack();
}

export async function handleSubmitPollAddOptionModal({
  ack,
  body,
  client,
  logger,
  payload,
}: HandleViewSubmitActionArgs) {
  if (!body.view.root_view_id) {
    throw new Error("View is missing root_view_id");
  }

  const metadata: {
    pollId: number;
    messageTs: string;
  } = JSON.parse(payload.private_metadata);

  await prisma.pollOption.create({
    data: {
      pollId: metadata.pollId,
      option: payload.state.values["option"]["option"].value || "",
    },
  });

  await refreshModalMessage(
    client,
    logger,
    body.view.root_view_id,
    metadata.messageTs,
    metadata.pollId,
  );

  await ack();
}

export async function handleSubmitPollEditTopicModal({
  ack,
  body,
  client,
  logger,
  payload,
}: HandleViewSubmitActionArgs) {
  if (!body.view.root_view_id) {
    throw new Error("View is missing root_view_id");
  }

  const metadata: {
    pollId: number;
    messageTs: string;
  } = JSON.parse(payload.private_metadata);

  await prisma.poll.update({
    where: {
      id: metadata.pollId,
    },
    data: {
      topic: payload.state.values["topic"]["topic"].value || "",
    },
  });

  await refreshModalMessage(
    client,
    logger,
    body.view.root_view_id,
    metadata.messageTs,
    metadata.pollId,
  );

  await ack();
}

async function refreshModalMessage(
  client: WebClient,
  logger: Logger,
  viewId: string,
  messageTs: string,
  pollId: number,
) {
  const poll = await prisma.poll.findUniqueOrThrow({
    where: {
      id: pollId,
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
          _count: {
            select: { pollVotes: true },
          },
        },
      },
      slackUser: true,
    },
  });

  try {
    await client.views.update({
      view_id: viewId,
      view: getEditModalView(messageTs, poll, poll.pollOptions),
    });

    await client.chat.update({
      channel: poll.channelId,
      ts: messageTs,
      blocks: getPollMessageBlocks(poll),
    });
  } catch (error) {
    logger.error(error);
  }
}
