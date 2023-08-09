import { PollType } from "@alfalfa/database/generated/client/index.js";
import {
  AllMiddlewareArgs,
  BlockButtonAction,
  SlackActionMiddlewareArgs,
} from "@slack/bolt";
import { CustomContext } from "../../../index.js";
import { prisma } from "../../../prisma-client.js";
import { findOrCreate } from "../../../data/slack-user.js";
import { getPollMessageBlocks } from "../../ui/lib/poll.js";

type HandlePollVoteButtonArgs = SlackActionMiddlewareArgs<BlockButtonAction> &
  AllMiddlewareArgs<CustomContext>;

export async function handlePollVoteButton({
  ack,
  body,
  client,
  logger,
  payload,
}: HandlePollVoteButtonArgs) {
  if (!body.message) {
    throw new Error("Body is missing message.");
  }

  if (!body.team) {
    throw new Error("Body is missing team");
  }

  const votedOption: { pollId: number; pollOptionId: number } = JSON.parse(
    payload.value,
  );

  const pollBasic = await prisma.poll.findUniqueOrThrow({
    where: {
      id: votedOption.pollId,
    },
  });

  const slackUser = await findOrCreate(body.team.id, body.user.id);

  let existingVote;
  if (pollBasic.type === PollType.SINGLE_VOTE) {
    existingVote = await prisma.pollVote.findFirst({
      where: {
        pollOption: {
          pollId: votedOption.pollId,
        },
        slackUserId: slackUser.id,
      },
    });
  } else {
    existingVote = await prisma.pollVote.findFirst({
      where: {
        pollOptionId: votedOption.pollOptionId,
        slackUserId: slackUser.id,
      },
    });
  }

  if (existingVote) {
    await prisma.pollVote.delete({
      where: {
        id: existingVote.id,
      },
    });
  }

  if (votedOption.pollOptionId !== existingVote?.pollOptionId) {
    await prisma.pollVote.create({
      data: {
        pollOptionId: votedOption.pollOptionId,
        slackUserId: slackUser.id || -1,
      },
    });
  }

  const poll = await prisma.poll.findUniqueOrThrow({
    where: {
      id: votedOption.pollId,
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

  if (pollBasic.deletedAt) {
    await ack();
    return;
  }

  try {
    client.chat.update({
      channel: poll.channelId,
      ts: body.message.ts,
      blocks: getPollMessageBlocks(poll),
    });
  } catch (error) {
    logger.error(error);
  }

  await ack();
}
