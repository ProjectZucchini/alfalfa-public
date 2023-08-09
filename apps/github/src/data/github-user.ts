import { type RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods/dist-types/generated/parameters-and-response-types";
import { Organization } from "@alfalfa/database/generated/client/index.js";
import { prisma } from "../prisma-client.js";
import { unDeleteUser } from "./user.js";

type MemberRest =
  RestEndpointMethodTypes["orgs"]["listMembers"]["response"]["data"][0];

export async function createGithubUser(
  githubUserRest: MemberRest,
  organization: Organization,
) {
  const githubUser = await prisma.gitHubUser.findUnique({
    where: {
      externalId: githubUserRest.id,
    },
    include: {
      users: {
        where: {
          organizationId: organization.id,
        },
      },
    },
  });

  if (!githubUser) {
    return prisma.gitHubUser.create({
      data: {
        externalId: githubUserRest.id,
        login: githubUserRest.login,
        users: {
          create: {
            organizationId: organization.id,
          },
        },
      },
    });
  } else if (!githubUser.users.length) {
    return prisma.gitHubUser.update({
      where: {
        id: githubUser.id,
      },
      data: {
        users: {
          create: {
            organizationId: organization.id,
          },
        },
      },
    });
  }

  if (githubUser.users[0].deletedAt !== null) {
    await unDeleteUser(githubUser.users[0]);
  }

  return githubUser;
}
