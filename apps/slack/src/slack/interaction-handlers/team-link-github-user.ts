import {
  findUserByOrganization,
  triggerAppHomeUpdate,
} from "@alfalfa/slack-lib";
import {
  AllMiddlewareArgs,
  BlockConversationsSelectAction,
  SlackActionMiddlewareArgs,
} from "@slack/bolt";
import { updateGitHubSlackLink } from "../../data/user.js";
import { CustomContext } from "../../index.js";
import { TeamConfigureModal } from "../ui/views/TeamConfigureModal.js";

type HandleConfigureTeamLinkGitHubUserArgs =
  SlackActionMiddlewareArgs<BlockConversationsSelectAction> &
    AllMiddlewareArgs<CustomContext>;

export async function handleConfigureTeamLinkGitHubUser({
  ack,
  body,
  client,
  context,
  payload,
  logger,
}: HandleConfigureTeamLinkGitHubUserArgs) {
  await ack();

  if (!body.team) {
    throw new Error("Body is missing team");
  }

  if (!body.view) {
    throw new Error("Body is missing view");
  }

  if (!payload.selected_conversation) {
    throw new Error("Selected option not received.");
  }

  const slackUsersUpdated = await updateGitHubSlackLink(
    context.organization,
    parseInt(payload.action_id.split(":")[2]),
    body.team.id,
    payload.selected_conversation,
  );

  const users = await findUserByOrganization(context.organization);

  const userConfigs = users.map((user) => {
    return {
      githubUserId: user.githubUser.id,
      githubLogin: user.githubUser.login,
      slackExternalId: user.slackUser?.externalId ?? null,
    };
  });

  for (const slackUserUpdated of slackUsersUpdated) {
    await triggerAppHomeUpdate(client, slackUserUpdated, context.organization);
  }

  try {
    await client.views.update({
      view_id: body.view.id,
      hash: body.view.hash,
      view: TeamConfigureModal({ userConfigs }),
    });
  } catch (error) {
    logger.error(error);
  }
}
