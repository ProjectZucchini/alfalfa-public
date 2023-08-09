import githubClient from "./github-client.js";

type GithubOrgMember = {
  id: number;
  name: string | null | undefined;
  email: string | null | undefined;
  login: string;
  avatarUrl: string;
};

export async function getOrgMembers(org: string): Promise<GithubOrgMember[]> {
  const members = await githubClient.rest.orgs.listMembers({
    org,
  });

  return members.data.map((member) => ({
    id: member.id,
    name: member.name,
    email: member.email,
    login: member.login,
    avatarUrl: member.avatar_url,
  }));
}
