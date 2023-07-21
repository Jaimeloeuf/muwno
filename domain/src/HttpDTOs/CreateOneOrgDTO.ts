import type { Org } from "../Org/index.js";

/**
 * DTO data used to create a single Org.
 */
export type CreateOneOrgDTO = {
  name: Org["name"];
};
