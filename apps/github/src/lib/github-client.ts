import { config } from "./config.js";
import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";

export const appClient = new Octokit({
  authStrategy: createAppAuth,
  auth: {
    appId: config.github.appId,
    privateKey: config.github.privateKey,
  },
});

export function getInstallationClient(installationId: number): Octokit {
  return new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId: config.github.appId,
      installationId,
      privateKey: config.github.privateKey,
    },
  });
}
