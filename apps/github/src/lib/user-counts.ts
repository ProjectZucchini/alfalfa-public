import { type Repository, type User } from "@octokit/webhooks-types";
import { getOrCreateByRepository } from "../data/github-repository.js";
import { findOrCreateByGitHubUser } from "../data/user.js";
import { increaseUserCounts } from "../data/user-count.js";

export async function updateUserCounts(
  eventType:
    | "issues.opened"
    | "pull_request.opened"
    | "pull_request.merged"
    | "pull_request_review.submitted",
  githubRepository: Repository,
  githubUser: User,
) {
  const repository = await getOrCreateByRepository(
    githubRepository,
    githubRepository.owner,
  );
  const user = await findOrCreateByGitHubUser(githubUser, repository);
  await increaseUserCounts(user, eventType, repository);
}
