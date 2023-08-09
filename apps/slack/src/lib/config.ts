interface GitHubConfig {
  appId: number;
  privateKeyPath: string;
}

interface SlackConfig {
  clientId: string;
  clientSecret: string;
  signingSecret: string;
  stateSecret: string;
}

interface Config {
  frontendUrl: string;
  hostName: string;
  jwtSigningSecret: string;
  github: GitHubConfig;
  slack: SlackConfig;
}

export const config: Config = {
  frontendUrl: process.env.FRONTEND_URL || "",
  hostName: process.env.HOST || "",
  jwtSigningSecret: process.env.JWT_SIGNING_SECRET || "",
  github: {
    appId: process.env.GH_APP_ID ? parseInt(process.env.GH_APP_ID) : 0,
    privateKeyPath: process.env.GH_PRIVATE_KEY_FILE || "",
  },
  slack: {
    clientId: process.env.SLACK_CLIENT_ID || "",
    clientSecret: process.env.SLACK_CLIENT_SECRET || "",
    signingSecret: process.env.SLACK_SIGNING_SECRET || "",
    stateSecret: process.env.SLACK_STATE_SECRET || "",
  },
};
