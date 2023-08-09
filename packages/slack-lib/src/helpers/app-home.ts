import {
  Organization,
  User,
} from "@alfalfa/database/generated/client/index.js";
import {
  HomeView,
  WebClient,
  type Block,
  type KnownBlock,
} from "@slack/web-api";
import { findAchievementsByUser } from "../data/achievement.js";
import { findUserBySlackUserId } from "../data/user.js";
import {
  AchievementCard,
  formatUserAchievement,
} from "../ui/block-templates/AchievementCard.js";

export async function triggerAppHomeUpdate(
  client: WebClient,
  slackUserId: string,
  organization: Organization,
) {
  let user: User | undefined = undefined;
  let userAchievements: Awaited<ReturnType<typeof findAchievementsByUser>> = [];

  try {
    user = await findUserBySlackUserId(slackUserId);
    userAchievements = await findAchievementsByUser(user, {
      sort: "desc",
      limit: 3,
    });
  } catch (err) {
    // Slack user has not been connected to Github User yet
  }

  await client.views.publish({
    user_id: slackUserId,
    view: AppHome({
      achievements: userAchievements.map((userAchievement) =>
        formatUserAchievement(userAchievement),
      ),
      user,
      organization,
    }),
  });
}

interface AchievementDisplay {
  title: string;
  description: string;
  earnedDate: string;
  earnedLink: string;
  imageUrl: string;
}

interface AppHomeProps {
  achievements: AchievementDisplay[];
  user: User | undefined;
  organization: Organization;
}

export function AppHome({
  achievements,
  user,
  organization,
}: AppHomeProps): HomeView {
  let blocks: (Block | KnownBlock)[] = [];

  if (user) {
    blocks = generateUserBlocks(achievements);
  } else {
    blocks = generateInitialSetupBlocks(organization);
  }

  return {
    type: "home",
    blocks,
  };
}

function generateUserBlocks(achievements: AchievementDisplay[]) {
  const blocks = [
    {
      type: "actions",
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            text: ":gear: Configure Team",
          },
          value: "configure_team",
          action_id: "home:configure_team",
        },
        {
          type: "button",
          text: {
            type: "plain_text",
            text: ":bar_chart: Team Stats",
          },
          value: "team_stats",
          action_id: "home:team_stats",
        },
      ],
    },
    {
      type: "divider",
    },
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
    // TODO: Figure out how to refactor this so we disallow returning arrays.
    // Maybe fragments/templates can always return "sections"?
    ...achievements
      .map((achievement) => {
        return [
          ...AchievementCard({
            title: achievement.title,
            description: achievement.description,
            imageUrl: achievement.imageUrl,
            earnedDate: achievement.earnedDate,
            earnedLink: achievement.earnedLink,
          }),
          {
            type: "divider",
          },
        ];
      })
      .flat(),
  ];

  if (achievements.length > 0) {
    blocks.push({
      type: "actions",
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            text: ":confetti_ball: View All",
          },
          value: "view_all_achievements",
          action_id: "home:view_all_achievements",
        },
      ],
    });
  } else {
    blocks.push({
      type: "section",
      text: {
        type: "plain_text",
        text: "None yet, but soon! :clap:",
      },
    });
  }

  return blocks;
}

function generateInitialSetupBlocks(organization: Organization) {
  const githubConnected = !!organization.githubOrganizationId;
  const journeyText = githubConnected
    ? "Start configuring your team to begin the journey. :tada:"
    : "Finish linking your GitHub organization to begin the journey. :tada:";

  return [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: ":heart: Fun and Silly Achievements :heart:",
      },
    },
    {
      type: "section",
      text: {
        type: "plain_text",
        text: `Celebrate your code contributions with lighthearted and fun achievements and statistics.
${journeyText}`,
      },
      ...(githubConnected && {
        accessory: {
          type: "button",
          text: {
            type: "plain_text",
            text: ":gear: Configure Team",
          },
          value: "configure_team",
          action_id: "home:configure_team",
        },
      }),
    },
  ];
}
