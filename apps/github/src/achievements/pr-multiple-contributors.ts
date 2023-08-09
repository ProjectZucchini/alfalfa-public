import { Endpoints } from "@octokit/types";
import {
  type PullRequestClosedEvent,
  type User,
} from "@octokit/webhooks-types";
import { type Achievement } from "@alfalfa/database/generated/client/index.js";
import parse from "parse-link-header";
import { type WebhookOctokit } from "../types/webhook-octokit.js";
import {
  BaseAchievement,
  type GitHubRepositoryWithGitHubOrganization,
} from "./base-achievement.js";

type CommitAuthor =
  Endpoints["GET /repos/{owner}/{repo}/pulls/{pull_number}/commits"]["response"]["data"][0]["author"];

export class PrMultipleContributors extends BaseAchievement<
  PullRequestClosedEvent,
  number
> {
  eventName: "pull_request.closed";
  webhookData: PullRequestClosedEvent;

  constructor(
    achievement: Achievement,
    eventName: "pull_request.closed",
    octokit: WebhookOctokit,
    repository: GitHubRepositoryWithGitHubOrganization,
    webhookData: PullRequestClosedEvent,
  ) {
    super(achievement, octokit, repository);
    this.eventName = eventName;
    this.webhookData = webhookData;
  }

  async transform(): Promise<number> {
    if (this.eventName !== "pull_request.closed") {
      throw Error(`Webhook event name not supported: ${this.eventName}`);
    }

    const commitAuthors = await this.getCommitAuthors();

    for (const commitAuthor of commitAuthors) {
      const isNewContributor = this.isNewContributor(commitAuthor.id);

      if (isNewContributor) {
        await this.addSecondaryUser(commitAuthor as User);
      }
    }

    return this.getUsers().length;
  }

  checkQualification(numberOfContributors: number): boolean {
    return numberOfContributors > 1;
  }

  async getCommitAuthors(pageNumber = 1) {
    const commitAuthors: NonNullable<CommitAuthor>[] = [];

    const { data, headers } = await this.octokit.rest.pulls.listCommits({
      owner: this.webhookData.repository.owner.login,
      repo: this.webhookData.repository.name,
      pull_number: this.webhookData.pull_request.number,
      page: pageNumber,
    });

    commitAuthors.push(
      ...(data
        .map((commitData) => commitData.author)
        .filter((author) => author !== null) as NonNullable<CommitAuthor>[]),
    );

    const pagination = parse(headers.link);

    if (pagination && pagination.next && pagination.next.page) {
      const response = await this.getCommitAuthors(
        parseInt(pagination.next.page),
      );
      commitAuthors.push(...response);
    }

    return commitAuthors;
  }

  getPrimaryUser() {
    return this.webhookData.pull_request.user;
  }

  isNewContributor(githubUserId: number) {
    return !this.getUsers().some(
      (user) => user.githubUser.externalId === githubUserId,
    );
  }
}
