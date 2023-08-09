import { findUserByOrganization } from "@alfalfa/slack-lib";
import {
  AllMiddlewareArgs,
  SlackAction,
  SlackActionMiddlewareArgs,
} from "@slack/bolt";
import { CustomContext } from "../../../index.js";
import { TeamConfigureModal } from "../../ui/views/TeamConfigureModal.js";

type TeamConfigureButtonClickedArgs = SlackActionMiddlewareArgs<SlackAction> &
  AllMiddlewareArgs<CustomContext>;

export async function handleTeamConfigureButton({
  ack,
  body,
  client,
  context,
  logger,
}: TeamConfigureButtonClickedArgs) {
  await ack();

  if (!body.team) {
    throw new Error("Body is missing Team ID.");
  }

  if (!("trigger_id" in body)) {
    throw new Error("Not not receive a BlockAction");
  }

  const users = await findUserByOrganization(context.organization);

  const userConfigs = users.map((user) => {
    return {
      githubUserId: user.githubUser.id,
      githubLogin: user.githubUser.login,
      slackExternalId: user.slackUser?.externalId ?? null,
    };
  });

  try {
    await client.views.open({
      trigger_id: body.trigger_id,
      view: TeamConfigureModal({ userConfigs }),
    });
  } catch (error) {
    logger.error(error);
  }
}
