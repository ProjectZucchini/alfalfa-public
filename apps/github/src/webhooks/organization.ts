import {
  type OrganizationMemberAddedEvent,
  type OrganizationMemberRemovedEvent,
} from "@octokit/webhooks-types";
import { Prisma } from "@alfalfa/database/generated/client/index.js";
import { createGithubUser } from "../data/github-user.js";
import { findByExternalId } from "../data/organization.js";
import { deleteUser, findByGitHubUser, unDeleteUser } from "../data/user.js";

export async function organizationMemberAdded({
  payload,
}: {
  payload: OrganizationMemberAddedEvent;
}) {
  let existingUser;

  try {
    existingUser = await findByGitHubUser(payload.membership.user, {
      includeDeleted: true,
    });
  } catch (error) {
    if (error instanceof Prisma.NotFoundError) {
      // This is fine. A user usually shouldn't exit already
    } else {
      throw error;
    }
  }

  if (existingUser) {
    await unDeleteUser(existingUser);
  } else {
    const organization = await findByExternalId(payload.organization.id);
    await createGithubUser(payload.membership.user, organization);
  }
}

export async function organizationMemberRemoved({
  payload,
}: {
  payload: OrganizationMemberRemovedEvent;
}) {
  const user = await findByGitHubUser(payload.membership.user);
  await deleteUser(user);
}
