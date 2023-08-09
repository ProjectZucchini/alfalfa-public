import * as fs from "node:fs";

interface GitHubConfig {
  appId: number;
  clientId: string;
  clientSecret: string;
  privateKey: string;
  webhookSecret: string;
}

interface Config {
  frontendUrl: string;
  jwtSigningSecret: string;
  github: GitHubConfig;
}

export const config: Config = {
  frontendUrl: process.env.FRONTEND_URL || "",
  jwtSigningSecret: process.env.JWT_SIGNING_SECRET || "",
  github: {
    appId: process.env.GH_APP_ID ? parseInt(process.env.GH_APP_ID) : 0,
    clientId: process.env.GH_CLIENT_ID || "",
    clientSecret: process.env.GH_CLIENT_SECRET || "",
    privateKey: getPrivateKey(),
    webhookSecret: process.env.GH_WEBHOOK_SECRET || "",
  },
};

function getPrivateKey() {
  if (process.env.GH_PRIVATE_KEY_FILE && process.env.GH_PRIVATE_KEY) {
    throw Error(
      "Both GH_PRIVATE_KEY_FILE and GH_PRIVATE_KEY env variables provided",
    );
  }

  if (process.env.GH_PRIVATE_KEY_FILE) {
    return fs.readFileSync(process.env.GH_PRIVATE_KEY_FILE || "", "utf-8");
  }

  return process.env.GH_PRIVATE_KEY || "";
}
