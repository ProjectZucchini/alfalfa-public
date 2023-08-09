import { type ActionsBlock, type SectionBlock } from "@slack/bolt";
import { type ModalView } from "@slack/web-api";

type CreatePollModalProps = {
  numOptions: number;
};

export function CreatePollModal({
  numOptions,
}: CreatePollModalProps): ModalView {
  const showAddMoreButton = numOptions < 10;

  return {
    type: "modal",
    callback_id: "poll:submit",
    title: {
      type: "plain_text",
      text: "Create Poll",
    },
    close: {
      type: "plain_text",
      text: "Cancel",
    },
    submit: {
      type: "plain_text",
      text: "Create",
    },
    blocks: [
      {
        type: "input",
        block_id: "topic",
        element: {
          type: "plain_text_input",
          action_id: "topic",
          placeholder: {
            type: "plain_text",
            text: "Poll topic",
          },
        },
        label: {
          type: "plain_text",
          text: "Poll Topic",
        },
      },
      ...[...Array(numOptions).keys()].map((optionNumber) => {
        const currentNumber = optionNumber + 1;

        return {
          type: "input",
          block_id: `option_${currentNumber}`,
          optional: optionNumber > 0,
          element: {
            type: "plain_text_input",
            action_id: `option_${currentNumber}`,
            placeholder: {
              type: "plain_text",
              text: `Option ${currentNumber}`,
            },
          },
          label: {
            type: "plain_text",
            text: `Option ${currentNumber}`,
          },
        };
      }),
      ...(showAddMoreButton
        ? [
            {
              type: "actions",
              elements: [
                {
                  type: "button",
                  text: {
                    type: "plain_text",
                    text: ":heavy_plus_sign: Add another option",
                  },
                  action_id: "poll:add_option",
                  value: numOptions.toString(),
                },
              ],
            } as ActionsBlock,
          ]
        : [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: "_Maximum of 10 options_",
              },
            } as SectionBlock,
          ]),
      {
        type: "input",
        block_id: "channel_select",
        element: {
          type: "conversations_select",
          action_id: "channel_select",
          default_to_current_conversation: true,
          filter: {
            include: ["public", "private"],
            exclude_bot_users: true,
          },
        },
        label: {
          type: "plain_text",
          text: "Channel to share to",
        },
      },
      {
        type: "divider",
      },
      {
        type: "input",
        block_id: "options",
        optional: true,
        element: {
          type: "checkboxes",
          action_id: "options",
          options: [
            {
              value: "anonymous_votes",
              text: {
                type: "plain_text",
                text: "Anonymous votes",
              },
            },
          ],
        },
        label: {
          type: "plain_text",
          text: "Options",
        },
      },
      {
        type: "input",
        block_id: "vote_count",
        element: {
          type: "static_select",
          action_id: "vote_count",
          placeholder: {
            type: "plain_text",
            text: "Select an option",
          },
          options: [
            {
              text: {
                type: "plain_text",
                text: "One vote",
              },
              value: "one",
            },
            {
              text: {
                type: "plain_text",
                text: "Multiple votes",
              },
              value: "multiple",
            },
          ],
          initial_option: {
            text: {
              type: "plain_text",
              text: "One vote",
            },
            value: "one",
          },
        },
        label: {
          type: "plain_text",
          text: "Votes per person",
        },
      },
    ],
  };
}
