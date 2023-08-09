import { type InstallationDeletedEvent } from "@octokit/webhooks-types";
import {
  getGitHubOrganizationByInstallation,
  updateGitHubOrganization,
} from "../data/github-organization.js";

export async function installationDeleted({
  payload,
}: {
  payload: InstallationDeletedEvent;
}) {
  const githubOrganization = await getGitHubOrganizationByInstallation(
    payload.installation,
  );
  return updateGitHubOrganization(githubOrganization, {
    githubInstallationId: null,
    deletedAt: new Date(),
  });
}
