import {
  findAchievementsByUser,
  findUserBySlackUserId,
} from "@alfalfa/slack-lib";
import { Prisma, User } from "@alfalfa/database/generated/client/index.js";
import {
  AllMiddlewareArgs,
  BlockConversationsSelectAction,
  SlackActionMiddlewareArgs,
} from "@slack/bolt";
import { CustomContext } from "../../../index.js";
import { getIndividualStatistics } from "../../../lib/statistics.js";
import {
  getTeamStatsIndividualAchievementsBlocks,
  getTeamStatsIndividualStatisticsBlock,
} from "../../ui/lib/team-stats.js";
import { TeamStatsModal } from "../../ui/views/TeamStatsModal.js";

type TeamStatsUserSelectProps =
  SlackActionMiddlewareArgs<BlockConversationsSelectAction> &
    AllMiddlewareArgs<CustomContext>;

export async function handleAchievementsUserSelect({
  ack,
  body,
  client,
  logger,
  payload,
}: TeamStatsUserSelectProps) {
  await ack();

  if (!body.view) {
    throw new Error("Body is missing View.");
  }

  if (!payload.selected_conversation) {
    throw new Error("Selected option not received.");
  }

  let userAchievements:
    | Awaited<ReturnType<typeof findAchievementsByUser>>
    | undefined;
  try {
    const user = await findUserBySlackUserId(payload.selected_conversation);
    userAchievements = await findAchievementsByUser(user, {
      sort: "desc",
    });
  } catch (error) {
    // It's okay if the selected user doesn't exist. It probably means they haven't been set up yet
    if (!(error instanceof Prisma.NotFoundError)) {
      logger.error(error);
    }
  }

  const bodyBlocks = getTeamStatsIndividualAchievementsBlocks(
    payload.selected_conversation,
    userAchievements,
  );

  try {
    await client.views.update({
      view_id: body.view.id,
      view: TeamStatsModal({
        selectedView: "individual-recent-sprouts",
        bodyBlocks,
      }),
    });
  } catch (error) {
    logger.error(error);
  }
}

export async function handleStatisticsUserSelect({
  ack,
  body,
  context,
  client,
  logger,
  payload,
}: TeamStatsUserSelectProps) {
  await ack();

  if (!body.view) {
    throw new Error("Body is missing View.");
  }

  if (!payload.selected_conversation) {
    throw new Error("Selected option not received.");
  }

  let user: User | undefined;
  try {
    user = await findUserBySlackUserId(payload.selected_conversation);
  } catch (error) {
    // It's okay if the selected user doesn't exist. It probably means they haven't been set up yet
    if (!(error instanceof Prisma.NotFoundError)) {
      logger.error(error);
    }
  }

  const statistics = await getIndividualStatistics(context.organization, user);
  const bodyBlocks = getTeamStatsIndividualStatisticsBlock(
    payload.selected_conversation,
    statistics,
  );

  try {
    await client.views.update({
      view_id: body.view.id,
      view: TeamStatsModal({
        selectedView: "individual-statistics",
        bodyBlocks,
      }),
    });
  } catch (error) {
    logger.error(error);
  }
}
