import { triggerAppHomeUpdate } from "@alfalfa/slack-lib";
import { SlackEventMiddlewareArgs, AllMiddlewareArgs } from "@slack/bolt";
import { CustomContext } from "../../index.js";

type AppHomeOpenedArgs = SlackEventMiddlewareArgs<"app_home_opened"> &
  AllMiddlewareArgs<CustomContext>;

export async function handleAppHomeOpened({
  client,
  context,
  payload,
}: AppHomeOpenedArgs) {
  await triggerAppHomeUpdate(client, payload.user, context.organization);
}
