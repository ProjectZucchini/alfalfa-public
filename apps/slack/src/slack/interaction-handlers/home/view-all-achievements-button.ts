import {
  findAchievementsByUser,
  findUserBySlackUserId,
} from "@alfalfa/slack-lib";
import {
  AllMiddlewareArgs,
  SlackAction,
  SlackActionMiddlewareArgs,
} from "@slack/bolt";
import { CustomContext } from "../../../index.js";
import { AllAchievementsModal } from "../../ui/views/AllAchievementsModal.js";

type ViewAllAchievementsButtonArgs = SlackActionMiddlewareArgs<SlackAction> &
  AllMiddlewareArgs<CustomContext>;

export async function handleViewAllAchievementsButton({
  ack,
  body,
  client,
  logger,
}: ViewAllAchievementsButtonArgs) {
  await ack();

  if (!body.team) {
    throw new Error("Body is missing Team ID.");
  }

  if (!("trigger_id" in body)) {
    throw new Error("Not not receive a BlockAction");
  }

  const user = await findUserBySlackUserId(body.user.id);
  const userAchievements = await findAchievementsByUser(user, {
    sort: "desc",
  });

  try {
    await client.views.open({
      trigger_id: body.trigger_id,
      view: AllAchievementsModal({ userAchievements }),
    });
  } catch (error) {
    logger.error(error);
  }
}
