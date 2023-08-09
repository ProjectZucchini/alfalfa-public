import {
  type IssuesOpenedEvent,
  type PullRequestOpenedEvent,
} from "@octokit/webhooks-types";
import { type Achievement } from "@alfalfa/database/generated/client/index.js";
import { type WebhookOctokit } from "../types/webhook-octokit.js";
import {
  BaseAchievement,
  type GitHubRepositoryWithGitHubOrganization,
} from "./base-achievement.js";

export class Palindrome extends BaseAchievement<
  IssuesOpenedEvent | PullRequestOpenedEvent,
  string
> {
  eventName: "issues.opened" | "pull_request.opened";
  webhookData: IssuesOpenedEvent | PullRequestOpenedEvent;

  constructor(
    achievement: Achievement,
    eventName: "issues.opened" | "pull_request.opened",
    octokit: WebhookOctokit,
    repository: GitHubRepositoryWithGitHubOrganization,
    webhookData: IssuesOpenedEvent | PullRequestOpenedEvent,
  ) {
    super(achievement, octokit, repository);
    this.eventName = eventName;
    this.webhookData = webhookData;
  }

  async transform(): Promise<string> {
    if (
      this.eventName !== "issues.opened" &&
      this.eventName !== "pull_request.opened"
    ) {
      throw Error(`Webhook event name not supported: ${this.eventName}`);
    }

    if (this.eventName === "issues.opened" && "issue" in this.webhookData) {
      return this.transformIssue(this.webhookData);
    }
    if (
      this.eventName === "pull_request.opened" &&
      "pull_request" in this.webhookData
    ) {
      return this.transformPullRequest(this.webhookData);
    }

    return "";
  }

  checkQualification(data: string): boolean {
    return data.length > 3 && data === data.split("").reverse().join("");
  }

  private transformIssue(data: IssuesOpenedEvent): string {
    return data.issue.number.toString();
  }

  private transformPullRequest(data: PullRequestOpenedEvent): string {
    return data.pull_request.number.toString();
  }

  getPrimaryUser() {
    let webhookUser;
    if ("issue" in this.webhookData) {
      webhookUser = this.webhookData.issue.user;
    } else if ("pull_request" in this.webhookData) {
      webhookUser = this.webhookData.pull_request.user;
    } else {
      throw Error("Can't determine user for Palindrome");
    }

    return webhookUser;
  }
}
