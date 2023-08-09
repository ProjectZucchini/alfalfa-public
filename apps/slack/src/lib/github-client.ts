import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";
import * as fs from "node:fs";
import { config } from "./config.js";

if (!config.github.privateKeyPath) {
  throw new Error("missing env var: GH_PRIVATE_KEY_FILE");
}

const appOctokit = new Octokit({
  authStrategy: createAppAuth,
  auth: {
    appId: config.github.appId,
    privateKey: fs.readFileSync(config.github.privateKeyPath, "utf-8"),
  },
});

export default appOctokit;
