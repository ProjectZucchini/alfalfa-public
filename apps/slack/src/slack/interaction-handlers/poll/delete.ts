import {
  AllMiddlewareArgs,
  SlackViewMiddlewareArgs,
  ViewSubmitAction,
} from "@slack/bolt";
import { CustomContext } from "../../../index.js";
import { prisma } from "../../../prisma-client.js";

type HandleSubmitPollDeleteModalArgs =
  SlackViewMiddlewareArgs<ViewSubmitAction> & AllMiddlewareArgs<CustomContext>;

export async function handleSubmitPollDeleteModal({
  ack,
  client,
  logger,
  payload,
}: HandleSubmitPollDeleteModalArgs) {
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
        deletedAt: new Date(),
      },
    });

    client.chat.delete({
      channel: poll.channelId,
      ts: metadata.messageTs,
    });
  } catch (error) {
    logger.error(error);
  }

  await ack();
}
