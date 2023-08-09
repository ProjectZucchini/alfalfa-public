import {
  AllMiddlewareArgs,
  BlockButtonAction,
  SlackActionMiddlewareArgs,
} from "@slack/bolt";
import { CustomContext } from "../../../index.js";
import { CreatePollModal } from "../../ui/views/modal/CreatePoll.js";

type HandlePollAddOptionButtonArgs =
  SlackActionMiddlewareArgs<BlockButtonAction> &
    AllMiddlewareArgs<CustomContext>;

export async function handlePollAddOptionButton({
  ack,
  body,
  client,
  logger,
  payload,
}: HandlePollAddOptionButtonArgs) {
  if (!body.view) {
    throw new Error("Body is missing View.");
  }

  try {
    client.views.update({
      view_id: body.view.id,
      hash: body.view.hash,
      view: CreatePollModal({
        numOptions: parseInt(payload.value) + 1,
      }),
    });
  } catch (error) {
    logger.error(error);
  }

  await ack();
}
