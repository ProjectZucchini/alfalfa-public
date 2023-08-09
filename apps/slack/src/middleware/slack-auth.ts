import { AllMiddlewareArgs, AnyMiddlewareArgs } from "@slack/bolt";
import { findBySlackTeamId } from "../data/organization.js";

export async function boltAuthMw({
  context,
  next,
}: AnyMiddlewareArgs & AllMiddlewareArgs) {
  if (!context.teamId) {
    throw new Error("Context is missing teamId.");
  }

  context.organization = await findBySlackTeamId(context.teamId);

  await next();
}
