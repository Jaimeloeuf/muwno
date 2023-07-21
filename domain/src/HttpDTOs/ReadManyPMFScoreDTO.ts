import type { PMFScore } from "../PMF/index.js";

/**
 * Read a Many `PMFScore` from API service.
 */
export type ReadManyPMFScoreDTO = {
  score: Array<PMFScore>;
};
