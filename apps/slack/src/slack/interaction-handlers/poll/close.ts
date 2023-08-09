import {
  AllMiddlewareArgs,
  SlackViewMiddlewareArgs,
  ViewSubmitAction,
} from "@slack/bolt";
import { CustomContext } from "../../../index.js";
import { prisma } from "../../../prisma-client.js";
import { getPollMessageBlocks } from "../../ui/lib/poll.js";

type HandleSubmitPollCloseModalArgs =
  SlackViewMiddlewareArgs<ViewSubmitAction> & AllMiddlewareArgs<CustomContext>;

export async function handleSubmitPollCloseModal({
  ack,
  client,
  logger,
  payload,
}: HandleSubmitPollCloseModalArgs) {
  const metadata: {
    pollId: number;
    messageTs: string;
  } = JSON.parse(payload.private_metadata);

  try {
    const poll = await prisma.poll.update({
      where: {
        id: metadata.pollId,
      },
      data: {
        closedAt: new Date(),
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

    client.chat.update({
      channel: poll.channelId,
      ts: metadata.messageTs,
      blocks: getPollMessageBlocks(poll),
    });
  } catch (error) {
    logger.error(error);
  }

  await ack();
}
