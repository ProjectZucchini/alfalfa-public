import { AllMiddlewareArgs, SlackShortcutMiddlewareArgs } from "@slack/bolt";
import { CustomContext } from "../../index.js";
import { CreatePollModal } from "../ui/views/modal/CreatePoll.js";

type CreatePollProps = SlackShortcutMiddlewareArgs &
  AllMiddlewareArgs<CustomContext>;

export async function handleCreatePoll({
  ack,
  client,
  logger,
  shortcut,
}: CreatePollProps) {
  await ack();

  try {
    await client.views.open({
      trigger_id: shortcut.trigger_id,
      view: CreatePollModal({
        numOptions: 2,
      }),
    });
  } catch (error) {
    logger.error(error);
  }
}
