import { ModalView, SectionBlock, ConversationsSelect } from "@slack/web-api";

type TeamConfigureModalProps = {
  userConfigs: {
    slackExternalId: string | null;
    githubUserId: number;
    githubLogin: string;
  }[];
};

export function TeamConfigureModal(props: TeamConfigureModalProps): ModalView {
  return {
    type: "modal",
    callback_id: "team_configure:submit",
    title: {
      type: "plain_text",
      text: "Team Configuration",
    },
    submit: {
      type: "plain_text",
      text: "Done!",
    },
    blocks: props.userConfigs.map((user) => {
      const accessory: ConversationsSelect = {
        action_id: `team_configure:github_user:${user.githubUserId}`,
        type: "conversations_select",
        ...(user.slackExternalId && {
          initial_conversation: user.slackExternalId,
        }),
        placeholder: {
          type: "plain_text",
          text: "Choose a user",
        },
        filter: {
          include: ["im"],
          exclude_bot_users: true,
        },
      };

      const selectUserRow: SectionBlock = {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `${
            user.slackExternalId ? ":large_green_circle:" : ":red_circle:"
          } <https://github.com/${user.githubLogin} | ${user.githubLogin}>`,
        },
        accessory,
      };
      return selectUserRow;
    }),
  };
}
