import { type Octokit } from "@octokit/core";
import { type PaginateInterface } from "@octokit/plugin-paginate-rest";
import { type Api } from "@octokit/plugin-rest-endpoint-methods/dist-types/types";
import { type RequestError } from "@octokit/request-error";

export type WebhookOctokit = Octokit & {
  paginate: PaginateInterface;
} & Api & {
    retry: {
      retryRequest: (
        error: RequestError,
        retries: number,
        retryAfter: number,
      ) => RequestError;
    };
  };
