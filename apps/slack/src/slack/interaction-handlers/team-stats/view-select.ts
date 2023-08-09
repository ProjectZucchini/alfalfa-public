import { findAchievementsByOrganization } from "@alfalfa/slack-lib";
import { Organization } from "@alfalfa/database/generated/client/index.js";
import {
  AllMiddlewareArgs,
  BlockAction,
  SlackActionMiddlewareArgs,
} from "@slack/bolt";
import { WebClient } from "@slack/web-api";
import { CustomContext } from "../../../index.js";
import { getOverallStatistics } from "../../../lib/statistics.js";
import {
  getOverallStatisticsBlocks,
  getTeamStatsAchievementsBlocks,
  getTeamStatsIndividualAchievementsBlocks,
  getTeamStatsIndividualStatisticsBlock,
  getUserInfo,
} from "../../ui/lib/team-stats.js";
import { SlackBlocks } from "../../ui/types.js";
import { TeamStatsModal } from "../../ui//views/TeamStatsModal.js";

type TeamStatsViewSelectProps = SlackActionMiddlewareArgs<BlockAction> &
  AllMiddlewareArgs<CustomContext>;

export async function handleTeamStatsViewSelect({
  ack,
  body,
  client,
  context,
  logger,
  payload,
}: TeamStatsViewSelectProps) {
  await ack();

  if (!body.view) {
    throw new Error("Body is missing View.");
  }

  if (!("selected_option" in payload)) {
    throw new Error("Not not receive a StaticSelectAction.");
  }

  if (!payload.selected_option?.value) {
    throw new Error("Selected option not received.");
  }

  let selectedView = "";
  let bodyBlocks: SlackBlocks = [];

  if (payload.selected_option.value === "all-recent-sprouts") {
    selectedView = "all-recent-sprouts";
    bodyBlocks = await recentAllAchievements(client, context.organization);
  }

  if (payload.selected_option.value === "overall-statistics") {
    selectedView = "overall-statistics";
    bodyBlocks = await overallStatistics(context.organization);
  }

  if (payload.selected_option.value === "individual-recent-sprouts") {
    selectedView = "individual-recent-sprouts";
    bodyBlocks = recentIndividualAchievements();
  }

  if (payload.selected_option.value === "individual-statistics") {
    selectedView = "individual-statistics";
    bodyBlocks = individualStatistics();
  }

  if (selectedView === "") {
    throw Error(`Unknown selectedView: ${selectedView}`);
  }

  try {
    await client.views.update({
      view_id: body.view.id,
      view: TeamStatsModal({ selectedView, bodyBlocks }),
    });
  } catch (error) {
    logger.error(error);
  }
}

async function recentAllAchievements(
  client: WebClient,
  organization: Organization,
) {
  const teamAchievements = await findAchievementsByOrganization(organization, {
    sort: "desc",
  });
  const userInfo = await getUserInfo(client, teamAchievements);
  return getTeamStatsAchievementsBlocks(teamAchievements, userInfo);
}

async function overallStatistics(organization: Organization) {
  const statistics = await getOverallStatistics(organization);
  return getOverallStatisticsBlocks(statistics);
}

function recentIndividualAchievements() {
  return getTeamStatsIndividualAchievementsBlocks("");
}

function individualStatistics() {
  return getTeamStatsIndividualStatisticsBlock("");
}
