import jwt from "jsonwebtoken";
import { config } from "./config.js";

export type UserTokenPayload = {
  userId?: string;
  slackUserId: number;
};

export function generateUserToken(payload: UserTokenPayload) {
  return jwt.sign(payload, config.jwtSigningSecret);
}

export function verifyUserToken(token: string) {
  let decoded;
  try {
    decoded = jwt.verify(token, config.jwtSigningSecret);
  } catch (err) {
    throw new Error(`Unable to verify JWT: ${err}`);
  }
  return decoded as UserTokenPayload;
}
