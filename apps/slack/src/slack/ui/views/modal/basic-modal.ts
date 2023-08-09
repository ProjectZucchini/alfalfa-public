import { type WebClient } from "@slack/web-api";

interface ShowBasicModalParams {
  client: WebClient;
  triggerId: string;
  title: string;
  message: string;
  callBackId?: string;
  metadata?: string;
  closeButtonText?: string;
  showCloseButton?: boolean;
  submitButtonText?: string;
  showSubmitButton?: boolean;
}

export async function showBasicModal({
  client,
  triggerId,
  callBackId,
  title,
  message,
  metadata,
  closeButtonText = "Cancel",
  showCloseButton = true,
  submitButtonText = "Submit",
  showSubmitButton = true,
}: ShowBasicModalParams) {
  await client.views.open({
    type: "modal",
    trigger_id: triggerId,
    view: {
      type: "modal",
      callback_id: callBackId,
      ...(metadata && { private_metadata: metadata }),
      ...(showCloseButton && {
        close: {
          type: "plain_text",
          text: closeButtonText,
        },
      }),
      ...(showSubmitButton && {
        submit: {
          type: "plain_text",
          text: submitButtonText,
        },
      }),
      title: {
        type: "plain_text",
        text: title,
      },
      blocks: [
        {
          type: "section",
          text: {
            type: "plain_text",
            text: message,
          },
        },
      ],
    },
  });
}
