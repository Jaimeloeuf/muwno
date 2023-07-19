import type { PMFLiveScore } from "../PMF/index.js";

/**
 * Read a single PMFLiveScore from API service.
 */
export type ReadOnePMFLiveScoreDTO = {
  score: PMFLiveScore | null;
};
