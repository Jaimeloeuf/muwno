import type { Plan } from "../Plan/index.js";

/**
 * Read many Active Plans from API service.
 */
export type ReadManyActivePlanDTO = {
  plans: Array<Plan>;
};
