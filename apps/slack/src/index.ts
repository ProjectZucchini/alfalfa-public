import serverlessExpress from "@vendia/serverless-express";
import { Organization } from "@alfalfa/database/generated/client/index.js";
import bolt from "@slack/bolt";

import { config } from "./lib/config.js";
import { boltAuthMw } from "./middleware/slack-auth.js";
import { handleAppHomeOpened } from "./slack/event-handlers/app-home-opened.js";
import {
  handleShareAchievementsButton,
  handleSubmitShareModal,
} from "./slack/interaction-handlers/messages-share.js";
import { handleTeamConfigureButton } from "./slack/interaction-handlers/home/team-configure-button.js";
import { handleTeamStatsButton } from "./slack/interaction-handlers/home/team-stats-button.js";
import { handlePollAddOptionButton } from "./slack/interaction-handlers/poll/add-option.js";
import { handleSubmitPollCloseModal } from "./slack/interaction-handlers/poll/close.js";
import { handleSubmitPollCreateModal } from "./slack/interaction-handlers/poll/create.js";
import { handleSubmitPollDeleteModal } from "./slack/interaction-handlers/poll/delete.js";
import {
  handlePollEditAddOptionButton,
  handlePollEditDeleteOptionButton,
  handlePollEditTopicButton,
  handleSubmitPollAddOptionModal,
  handleSubmitPollEditTopicModal,
} from "./slack/interaction-handlers/poll/edit.js";
import { handlePollOptionsButton } from "./slack/interaction-handlers/poll/options.js";
import { handlePollVoteButton } from "./slack/interaction-handlers/poll/vote.js";
import {
  handleAchievementsUserSelect,
  handleStatisticsUserSelect,
} from "./slack/interaction-handlers/team-stats/individual-user-select.js";
import { handleTeamStatsViewSelect } from "./slack/interaction-handlers/team-stats/view-select.js";
import { handleViewAllAchievementsButton } from "./slack/interaction-handlers/home/view-all-achievements-button.js";
import { handleConfigureTeamLinkGitHubUser } from "./slack/interaction-handlers/team-link-github-user.js";
import { handleCreatePoll } from "./slack/shortcut-handlers/poll.js";
import { installationStore } from "./slack/installation-store.js";
import { installerOptions } from "./slack/installer-options.js";

export interface CustomContext {
  organization: Organization;
}

export const expressReceiver = new bolt.ExpressReceiver({
  signingSecret: config.slack.signingSecret,
  clientId: config.slack.clientId,
  clientSecret: config.slack.clientSecret,
  stateSecret: config.slack.stateSecret,
  installationStore: installationStore,
  installerOptions: installerOptions,
  processBeforeResponse: true,
  scopes: ["chat:write", "users:read"],
  dispatchErrorHandler: async ({ error, logger, request, response }) => {
    logger.error(`dispatch error: ${error}`, (request as any).body);
    response.writeHead(200);
    response.write("Something went wrong! :face_palm: Please try again.");
    response.end();
  },
  processEventErrorHandler: async ({ error, logger, request, response }) => {
    logger.error(`processEvent error: ${error}`, (request as any).body);
    response.writeHead(200);
    response.write("Something went wrong! :face_palm: Please try again.");
    response.end();
    return true;
  },
  unhandledRequestHandler: async ({ logger, request, response }) => {
    logger.error("UnhandledRequestError", (request as any).body);
    response.writeHead(200);
    response.write("Something went wrong! :face_palm: Please try again.");
    response.end();
  },
  unhandledRequestTimeoutMillis: 2000,
});

const app = new bolt.App<CustomContext>({
  logLevel: process.env.IS_OFFLINE ? bolt.LogLevel.DEBUG : bolt.LogLevel.INFO,
  receiver: expressReceiver,
});

app.use(boltAuthMw);

app.event("app_home_opened", handleAppHomeOpened);

app.action(
  /team_configure:github_user:[0-9]+/,
  handleConfigureTeamLinkGitHubUser,
);
app.view("team_configure:submit", async ({ ack }) => {
  // All the work is done when selecting the users, so we can just close the modal
  await ack();
});

app.action("home:configure_team", handleTeamConfigureButton);
app.action("home:team_stats", handleTeamStatsButton);
app.action("home:view_all_achievements", handleViewAllAchievementsButton);

app.action("messages:share", handleShareAchievementsButton);
app.view("messages:share_submit", handleSubmitShareModal);

app.shortcut("create_poll", handleCreatePoll);
app.action("poll:add_option", handlePollAddOptionButton);
app.action("poll:edit:option:add", handlePollEditAddOptionButton);
app.action("poll:edit:option:delete", handlePollEditDeleteOptionButton);
app.action("poll:edit:topic", handlePollEditTopicButton);
app.action("poll:options", handlePollOptionsButton);
app.action("poll:vote", handlePollVoteButton);
app.view("poll:close", handleSubmitPollCloseModal);
app.view("poll:edit:option:add", handleSubmitPollAddOptionModal);
app.view("poll:edit:topic", handleSubmitPollEditTopicModal);
app.view("poll:delete", handleSubmitPollDeleteModal);
app.view("poll:submit", handleSubmitPollCreateModal);

app.action("team_stats:select_view", handleTeamStatsViewSelect);
app.action(
  "team_stats:individual_achievements_user_select",
  handleAchievementsUserSelect,
);
app.action(
  "team_stats:individual_statistics_user_select",
  handleStatisticsUserSelect,
);

// Exporting handler for Lambda runtime
export const handler = serverlessExpress({
  app: expressReceiver.app,
});
