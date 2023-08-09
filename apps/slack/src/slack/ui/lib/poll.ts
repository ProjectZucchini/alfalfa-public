import { Poll, Prisma } from "@alfalfa/database/generated/client/index.js";
import { formatLocalDate } from "@alfalfa/slack-lib";

const WORD_NUMBERS = [
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
];

type PollWithOptions = Prisma.PollGetPayload<{
  include: {
    pollOptions: { include: { pollVotes: { include: { slackUser: true } } } };
    slackUser: true;
  };
}>;

export function getPollMessageBlocks(poll: PollWithOptions) {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*${poll.topic}* by <@${poll.slackUser.externalId}>`,
      },
      accessory: {
        type: "overflow",
        options: [
          {
            text: {
              type: "plain_text",
              text: ":pencil: Edit",
            },
            value: JSON.stringify({ option: "edit", pollId: poll.id }),
          },
          ...(!poll.closedAt
            ? [
                {
                  text: {
                    type: "plain_text",
                    text: ":lock: Close",
                  },
                  value: JSON.stringify({ option: "close", pollId: poll.id }),
                },
              ]
            : []),
          {
            text: {
              type: "plain_text",
              text: ":x: Delete",
            },
            value: JSON.stringify({ option: "delete", pollId: poll.id }),
          },
        ],
        action_id: "poll:options",
      },
    },
    ...getPollContextText(poll),
    {
      type: "divider",
    },
    ...poll.pollOptions
      .map((option, idx) => [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `${getOptionEmoji(idx)} ${option.option} _(${
              option.pollVotes.length
            } ${option.pollVotes.length === 1 ? "vote" : "votes"})_`,
          },
          ...(!poll.closedAt && {
            accessory: {
              type: "button",
              text: {
                type: "plain_text",
                text: `${getOptionEmoji(idx)} Vote`,
              },
              action_id: "poll:vote",
              value: JSON.stringify({
                pollId: poll.id,
                pollOptionId: option.id,
              }),
            },
          }),
        },
        ...(!poll.anonymousVotes && option.pollVotes.length > 0
          ? [
              {
                type: "context",
                elements: option.pollVotes.map((vote) => ({
                  type: "mrkdwn",
                  text: `<@${vote.slackUser.externalId}>`,
                })),
              },
            ]
          : []),
      ])
      .flat(),
    ...(poll.closedAt
      ? [
          {
            type: "context",
            elements: [
              {
                type: "mrkdwn",
                text: `:lock: Poll closed at _${formatLocalDate(
                  poll.closedAt,
                )}_`,
              },
            ],
          },
        ]
      : []),
  ];
}

function getPollContextText(poll: Poll) {
  const messages = [];

  if (poll.anonymousVotes) {
    messages.push(":question: Anonymous votes");
  }

  if (messages.length > 0) {
    return [
      {
        type: "context",
        elements: [
          {
            type: "plain_text",
            text: messages.join("\n"),
          },
        ],
      },
    ];
  }

  return [];
}

export function getOptionEmoji(optionNumber: number) {
  return `${
    optionNumber === 9 ? ":keycap_ten:" : `:${WORD_NUMBERS[optionNumber]}:`
  }`;
}
