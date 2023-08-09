import bolt from "@slack/bolt";
import { config } from "../lib/config.js";
import { findOrCreate as findOrCreateSlackUser } from "../data/slack-user.js";
import { generateUserToken } from "../lib/authentication.js";

export const installerOptions: bolt.HTTPReceiverOptions["installerOptions"] = {
  directInstall: true,
  userScopes: ["users:read"],
  callbackOptions: {
    success: async (installation, installOptions, req, res) => {
      if (!installation.team?.id) {
        // This probably shouldn't ever happen?
        throw new Error("Missing teamId from installation payload");
      }

      const slackUser = await findOrCreateSlackUser(
        installation.team.id,
        installation.user.id,
      );
      const userToken = generateUserToken({ slackUserId: slackUser.id });

      res
        .writeHead(302, {
          "Set-Cookie": `session=${userToken}; Domain=${config.hostName}; path=/`,
          Location: `${config.frontendUrl}/connect-github`,
        })
        .end();
    },
    failure: (error, installOptions, req, res) => {
      console.error(`Error installing Slack App`, error);
      res.end("Failed");
    },
  },
};
