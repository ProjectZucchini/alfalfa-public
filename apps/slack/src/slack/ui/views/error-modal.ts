import { WebClient } from "@slack/web-api";

export async function showError(
  errorMessage: string,
  client: WebClient,
  triggerId: string,
) {
  await client.views.open({
    trigger_id: triggerId,
    view: {
      type: "modal",
      title: {
        type: "plain_text",
        text: "Error",
      },
      blocks: [
        {
          type: "section",
          text: {
            type: "plain_text",
            text: errorMessage,
          },
        },
      ],
    },
  });
}
