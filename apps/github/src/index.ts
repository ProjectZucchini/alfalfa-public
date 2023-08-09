import serverlessExpress from "@vendia/serverless-express";
import express from "express";
import { App, createNodeMiddleware } from "octokit";
import { config } from "./lib/config.js";
import { bufferToString } from "./middleware/buffer-to-string.js";
import { hello } from "./routes/hello.js";
import { postInstall } from "./routes/post-install.js";
import { installationDeleted } from "./webhooks/installation.js";
import { issuesOpened } from "./webhooks/issues.js";
import {
  organizationMemberAdded,
  organizationMemberRemoved,
} from "./webhooks/organization.js";
import {
  pullRequestClosed,
  pullRequestOpened,
} from "./webhooks/pull-request.js";
import { pullRequestReviewSubmitted } from "./webhooks/pull-request-review.js";

const webhookApp = new App({
  appId: config.github.appId,
  privateKey: config.github.privateKey,
  oauth: {
    clientId: config.github.clientId,
    clientSecret: config.github.clientSecret,
  },
  webhooks: {
    secret: config.github.webhookSecret,
  },
});

webhookApp.webhooks.on("installation.deleted", installationDeleted);

webhookApp.webhooks.on("issues.opened", issuesOpened);

webhookApp.webhooks.on("organization.member_added", organizationMemberAdded);
webhookApp.webhooks.on(
  "organization.member_removed",
  organizationMemberRemoved,
);

webhookApp.webhooks.on("pull_request.closed", pullRequestClosed);
webhookApp.webhooks.on("pull_request.opened", pullRequestOpened);

webhookApp.webhooks.on(
  "pull_request_review.submitted",
  pullRequestReviewSubmitted,
);

const expressApp = express();
expressApp.use(bufferToString);
expressApp.use(createNodeMiddleware(webhookApp));
expressApp.get("/github/hello", hello);
expressApp.get("/github/post-install", postInstall);

// Exporting handler for Lambda runtime
export const handler = serverlessExpress({
  app: expressApp,
});
