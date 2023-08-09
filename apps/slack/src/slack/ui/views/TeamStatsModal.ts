import { type ModalView, type PlainTextOption } from "@slack/web-api";
import { SlackBlocks } from "../types.js";

const VIEW_OPTIONS: PlainTextOption[] = [
  {
    text: {
      type: "plain_text",
      text: "Most Recent Sprouts",
    },
    value: "all-recent-sprouts",
  },
  {
    text: {
      type: "plain_text",
      text: "Overall Statistics",
    },
    value: "overall-statistics",
  },
  {
    text: {
      type: "plain_text",
      text: "Individual Recent Sprouts",
    },
    value: "individual-recent-sprouts",
  },
  {
    text: {
      type: "plain_text",
      text: "Individual Statistics",
    },
    value: "individual-statistics",
  },
];

type TeamStatsModalProps = {
  selectedView: string;
  bodyBlocks: SlackBlocks;
};

export function TeamStatsModal({
  selectedView,
  bodyBlocks,
}: TeamStatsModalProps): ModalView {
  return {
    type: "modal",
    title: {
      type: "plain_text",
      text: "Team Statistics",
    },
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "Choose a statistic view",
        },
        accessory: {
          type: "static_select",
          action_id: "team_stats:select_view",
          initial_option: VIEW_OPTIONS.find(
            (viewOption) => viewOption.value === selectedView,
          ),
          options: VIEW_OPTIONS,
        },
      },
      ...bodyBlocks,
    ],
  };
}
