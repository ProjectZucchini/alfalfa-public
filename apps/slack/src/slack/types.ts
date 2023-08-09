import { Organization } from "@alfalfa/database/generated/client/index.js";

export interface CustomContext {
  organization: Organization;
}
