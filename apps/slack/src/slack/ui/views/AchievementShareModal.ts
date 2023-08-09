import { AchievementCard, AchievementCardProps } from "@alfalfa/slack-lib";
import { ModalView } from "@slack/web-api";

interface AchievementShareModalProps {
  achievementCard: AchievementCardProps;
  slackUserId: string;
  userAchievementId: string;
}

export function AchievementShareModal({
  achievementCard,
  slackUserId,
  userAchievementId,
}: AchievementShareModalProps): ModalView {
  return {
    type: "modal",
    callback_id: "messages:share_submit",
    private_metadata: JSON.stringify({ userAchievementId }),
    title: {
      type: "plain_text",
      text: "Share Sprout",
    },
    submit: {
      type: "plain_text",
      text: "Share!",
    },
    blocks: [
      {
        type: "input",
        block_id: "channel_select",
        element: {
          type: "channels_select",
          action_id: "channel_select",
        },
        label: {
          type: "plain_text",
          text: "Channel to share to",
        },
      },
      {
        type: "section",
        text: {
          type: "plain_text",
          text: "The shared message will look like:",
        },
      },
      {
        type: "divider",
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `:tada: Congrats :confetti_ball: to <@${slackUserId}> for earning a Sprout! :grinning_face_with_star_eyes:`,
        },
      },
      ...AchievementCard(achievementCard),
      {
        type: "divider",
      },
    ],
  };
}
