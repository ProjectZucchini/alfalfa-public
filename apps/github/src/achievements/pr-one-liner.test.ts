import { AchievementUserQualifyRestriction } from "@alfalfa/database/generated/client/index.js";
import { type PullRequestClosedEvent } from "@octokit/webhooks-types";
import { describe, expect, test } from "vitest";
import { AchievementType } from "./lib/achievement-type.js";
import { type GitHubRepositoryWithGitHubOrganization } from "./base-achievement.js";
import { PrOneLiner } from "./pr-one-liner.js";

const OneLinerAchievement = {
  id: 1,
  name: "One-Liner",
  description: "One-Liner",
  type: AchievementType.ONE_LINE_CHANGE,
  userQualifyRestriction: AchievementUserQualifyRestriction.ORGANIZATION,
  imageUrl: "",
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

describe("PrOneLiner", () => {
  test("Qualifies - 1 addition", async () => {
    const prOneLiner = getOneLinerClass({
      pull_request: {
        merged: true,
        additions: 1,
        deletions: 0,
      },
    } as PullRequestClosedEvent);

    expect(
      prOneLiner.checkQualification(await prOneLiner.transform()),
    ).toBeTruthy();
  });

  test("Qualifies - 1 deletion", async () => {
    const prOneLiner = getOneLinerClass({
      pull_request: {
        merged: true,
        additions: 0,
        deletions: 1,
      },
    } as PullRequestClosedEvent);

    expect(
      prOneLiner.checkQualification(await prOneLiner.transform()),
    ).toBeTruthy();
  });

  test("Qualifies - 1 addition and deletion", async () => {
    const prOneLiner = getOneLinerClass({
      pull_request: {
        merged: true,
        additions: 1,
        deletions: 1,
      },
    } as PullRequestClosedEvent);

    expect(
      prOneLiner.checkQualification(await prOneLiner.transform()),
    ).toBeTruthy();
  });

  test("No Qualifies - Not merged", async () => {
    const prOneLiner = getOneLinerClass({
      pull_request: {
        merged: false,
        additions: 1,
        deletions: 0,
      },
    } as PullRequestClosedEvent);

    expect(
      prOneLiner.checkQualification(await prOneLiner.transform()),
    ).toBeFalsy();
  });

  test("No Qualifies - More than 1", async () => {
    const prOneLiner = getOneLinerClass({
      pull_request: {
        merged: true,
        additions: 10,
        deletions: 0,
      },
    } as PullRequestClosedEvent);

    expect(
      prOneLiner.checkQualification(await prOneLiner.transform()),
    ).toBeFalsy();
  });

  test("No Qualifies - 0 addition and deletion", async () => {
    const prOneLiner = getOneLinerClass({
      pull_request: {
        merged: true,
        additions: 0,
        deletions: 0,
      },
    } as PullRequestClosedEvent);

    expect(
      prOneLiner.checkQualification(await prOneLiner.transform()),
    ).toBeFalsy();
  });
});

function getOneLinerClass(prClosedEvent: PullRequestClosedEvent) {
  return new PrOneLiner(
    OneLinerAchievement,
    "pull_request.closed",
    {} as any,
    {} as GitHubRepositoryWithGitHubOrganization,
    prClosedEvent as PullRequestClosedEvent,
  );
}
