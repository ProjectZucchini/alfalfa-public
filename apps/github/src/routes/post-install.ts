import cookie from "cookie";
import { type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../lib/config.js";
import { completeInstallation } from "../lib/installation.js";

export async function postInstall(req: Request, res: Response) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const userTokenPayload = verifySession(req.headers.cookie);
  const parsedParams = new URLSearchParams(url.search);
  const installationId = parsedParams.get("installation_id");

  if (!installationId) {
    throw new Error("Missing Installation Id");
  }

  await completeInstallation(userTokenPayload.slackUserId, +installationId);

  res.redirect(302, `${config.frontendUrl}/success`);
}

// TODO: This should be a shared type between the slack and github apps
type UserTokenPayload = {
  userId?: string;
  slackUserId: number;
};

function verifySession(rawCookies?: string): UserTokenPayload {
  // TODO: What kind of error handling do we need here
  if (!rawCookies) {
    throw new Error("Missing session cookie");
  }
  const cookies = cookie.parse(rawCookies);

  if (!cookies.session) {
    throw new Error("Missing session cookie");
  }

  return jwt.verify(
    cookies.session,
    config.jwtSigningSecret,
  ) as UserTokenPayload;
}
