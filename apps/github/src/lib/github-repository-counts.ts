import { type Repository } from "@octokit/webhooks-types";
import { getOrCreateByRepository } from "../data/github-repository.js";
import { increaseGitHubRepositoryCounts } from "../data/github-repository-count.js";

export async function updateGitHubRepositoryCounts(
  eventType: "pull_request.merged",
  githubRepository: Repository,
) {
  const repository = await getOrCreateByRepository(
    githubRepository,
    githubRepository.owner,
  );
  await increaseGitHubRepositoryCounts(eventType, repository);
}
