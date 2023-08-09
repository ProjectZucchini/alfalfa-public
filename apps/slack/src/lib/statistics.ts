import {
  Organization,
  User,
} from "@alfalfa/database/generated/client/index.js";
import {
  getAverageEarnedByOrganization,
  getTotalEarnedByUser,
  getTotalEarnedByOrganization,
} from "../data/achievements.js";
import {
  getAverageSharedByOrganization,
  getTotalSharedByOrganization,
  getTotalSharedByUser,
} from "../data/slack-share.js";

export async function getOverallStatistics(organization: Organization) {
  return {
    totalEarned: await getTotalEarnedByOrganization(organization),
    averageEarned: await getAverageEarnedByOrganization(organization),
    totalShared: await getTotalSharedByOrganization(organization),
    averageShared: await getAverageSharedByOrganization(organization),
  };
}

export async function getIndividualStatistics(
  organization: Organization,
  user: User | undefined,
) {
  if (!user) {
    return undefined;
  }

  return {
    totalEarned: await getTotalEarnedByUser(organization, user),
    totalShared: await getTotalSharedByUser(organization, user),
  };
}
