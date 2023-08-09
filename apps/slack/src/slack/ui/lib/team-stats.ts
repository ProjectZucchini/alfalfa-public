import {
  findAchievementsByOrganization,
  findAchievementsByUser,
} from "@alfalfa/slack-lib";
import { type WebClient } from "@slack/web-api";
import {
  StatsAchievementCard,
  formatStatsAchievement,
} from "../views/StatsAchievementCard.js";
import {
  IndividualStatsAchievementCard,
  formatIndividualStatsAchievement,
} from "../views/IndividualStatsAchievementCard.js";

interface UserInfo {
  [key: string]: {
    id: string;
    name?: string;
    imageUrl?: string;
  };
}

export function getTeamStatsAchievementsBlocks(
  teamAchievements: Awaited<ReturnType<typeof findAchievementsByOrganization>>,
  userInfoMap: UserInfo,
) {
  return [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "Most Recent Sprouts",
      },
    },
    {
      type: "divider",
    },
    ...teamAchievements
      .map((teamAchievement) => {
        const userInfo =
          userInfoMap[teamAchievement.user.slackUser?.externalId || ""];
        if (!userInfo) {
          return [];
        }

        return [
          ...StatsAchievementCard({
            userId: userInfo.id,
            userName: userInfo.name || "",
            userImageUrl: userInfo.imageUrl || "",
            ...formatStatsAchievement(teamAchievement),
          }),
          {
            type: "divider",
          },
        ];
      })
      .flat(),
  ];
}

export function getOverallStatisticsBlocks({
  totalEarned,
  averageEarned,
  totalShared,
  averageShared,
}: {
  totalEarned: number;
  averageEarned: number;
  totalShared: number;
  averageShared: number;
}) {
  return [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "Overall Statistics",
      },
    },
    {
      type: "divider",
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Total Earned*: ${totalEarned} · *Average # earned per user*: ${averageEarned}`,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Total Shared*: ${totalShared} · *Average # shared per user*: ${averageShared}`,
      },
    },
  ];
}

export function getTeamStatsIndividualAchievementsBlocks(
  selectedUser: string,
  userAchievements?: Awaited<ReturnType<typeof findAchievementsByUser>>,
) {
  return [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "Individual Recent Sprouts",
      },
    },
    {
      type: "actions",
      elements: [
        {
          action_id: "team_stats:individual_achievements_user_select",
          type: "conversations_select",
          ...(selectedUser && {
            initial_conversation: selectedUser,
          }),
          placeholder: {
            type: "plain_text",
            text: "Choose a user",
          },
          filter: {
            include: ["im"],
            exclude_bot_users: true,
          },
        },
      ],
    },
    {
      type: "divider",
    },
    ...(userAchievements !== undefined
      ? userAchievements
          .map((userAchievement) => {
            return [
              ...IndividualStatsAchievementCard(
                formatIndividualStatsAchievement(userAchievement),
              ),
              {
                type: "divider",
              },
            ];
          })
          .flat()
      : []),
    ...(selectedUser && userAchievements && userAchievements.length === 0
      ? [
          {
            type: "section",
            text: {
              type: "plain_text",
              text: "No Sprouts yet...",
            },
          },
        ]
      : []),
    ...(selectedUser && userAchievements === undefined
      ? [
          {
            type: "section",
            text: {
              type: "plain_text",
              text: "User hasn't been set up yet :thinking_face:",
            },
          },
        ]
      : []),
  ];
}

export function getTeamStatsIndividualStatisticsBlock(
  selectedUser: string,
  stats?: {
    totalEarned: number;
    totalShared: number;
  },
) {
  return [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "Individual Statistics",
      },
    },
    {
      type: "actions",
      elements: [
        {
          action_id: "team_stats:individual_statistics_user_select",
          type: "conversations_select",
          ...(selectedUser && {
            initial_conversation: selectedUser,
          }),
          placeholder: {
            type: "plain_text",
            text: "Choose a user",
          },
          filter: {
            include: ["im"],
            exclude_bot_users: true,
          },
        },
      ],
    },
    {
      type: "divider",
    },
    ...(selectedUser && stats
      ? [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `
*Total Earned*: ${stats.totalEarned}\n
*Total Shared*: ${stats.totalShared} `,
            },
          },
        ]
      : []),
    ...(selectedUser && !stats
      ? [
          {
            type: "section",
            text: {
              type: "plain_text",
              text: "User hasn't been set up yet :thinking_face:",
            },
          },
        ]
      : []),
  ];
}

export async function getUserInfo(
  client: WebClient,
  teamAchievements: Awaited<ReturnType<typeof findAchievementsByOrganization>>,
): Promise<UserInfo> {
  const slackUsers = new Set<string>();
  for (const teamAchievement of teamAchievements) {
    if (teamAchievement.user.slackUser?.externalId) {
      slackUsers.add(teamAchievement.user.slackUser.externalId);
    }
  }

  const userInfoRequests = [];
  for (const slackUser of slackUsers) {
    userInfoRequests.push(client.users.info({ user: slackUser }));
  }
  const results = await Promise.allSettled(userInfoRequests);

  const successResults = [];
  for (const result of results) {
    if (result.status === "fulfilled") {
      successResults.push(result);
    }
  }

  return successResults.reduce<UserInfo>((slackUserMap, result) => {
    const user = result.value.user;
    if (user && user.id) {
      slackUserMap[user.id] = {
        id: user.id,
        name: user.profile?.real_name,
        imageUrl: user.profile?.image_24,
      };
    }
    return slackUserMap;
  }, {});
}
