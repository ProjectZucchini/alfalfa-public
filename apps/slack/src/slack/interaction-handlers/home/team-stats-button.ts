import { findAchievementsByOrganization } from "@alfalfa/slack-lib";
import {
  AllMiddlewareArgs,
  SlackAction,
  SlackActionMiddlewareArgs,
} from "@slack/bolt";
import { CustomContext } from "../../../index.js";
import {
  getTeamStatsAchievementsBlocks,
  getUserInfo,
} from "../../ui/lib/team-stats.js";
import { TeamStatsModal } from "../../ui/views/TeamStatsModal.js";

type TeamConfigureButtonClickedArgs = SlackActionMiddlewareArgs<SlackAction> &
  AllMiddlewareArgs<CustomContext>;

export async function handleTeamStatsButton({
  ack,
  body,
  client,
  context,
  logger,
}: TeamConfigureButtonClickedArgs) {
  await ack();

  if (!("trigger_id" in body)) {
    throw new Error("Not not receive a BlockAction");
  }

  const teamAchievements = await findAchievementsByOrganization(
    context.organization,
    {
      sort: "desc",
    },
  );
  const userInfo = await getUserInfo(client, teamAchievements);

  try {
    await client.views.open({
      trigger_id: body.trigger_id,
      view: TeamStatsModal({
        selectedView: "all-recent-sprouts",
        bodyBlocks: getTeamStatsAchievementsBlocks(teamAchievements, userInfo),
      }),
    });
  } catch (error) {
    logger.error(error);
  }
}
