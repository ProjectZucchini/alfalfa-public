import bolt from "@slack/bolt";
import {
  deleteInstallation,
  fetchInstallation,
  storeInstallation,
} from "../data/slack-workspace.js";

export const installationStore: bolt.InstallationStore = {
  storeInstallation: async (installation) => {
    // support for org wide app installation
    if (
      installation.isEnterpriseInstall &&
      installation.enterprise !== undefined
    ) {
      throw Error("Enterprise installation not supported");
    }

    // single team app installation
    if (installation.team !== undefined) {
      return await storeInstallation(installation);
    }

    throw new Error("Failed saving installation data to installationStore");
  },
  fetchInstallation: async (installQuery) => {
    // org wide app installation lookup
    if (
      installQuery.isEnterpriseInstall &&
      installQuery.enterpriseId !== undefined
    ) {
      throw Error("Enterprise installation not supported");
    }

    // single team app installation lookup
    if (installQuery.teamId !== undefined) {
      return await fetchInstallation(
        installQuery as bolt.InstallationQuery<false>,
      );
    }

    throw new Error("Failed fetching installation");
  },
  deleteInstallation: async (installQuery) => {
    // org wide app installation deletion
    if (
      installQuery.isEnterpriseInstall &&
      installQuery.enterpriseId !== undefined
    ) {
      throw Error("Enterprise installation not supported");
    }

    // single team app installation deletion
    if (installQuery.teamId !== undefined) {
      await deleteInstallation(installQuery as bolt.InstallationQuery<false>);
      return;
    }

    throw new Error("Failed to delete installation");
  },
};
