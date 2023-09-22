import { useLiveScore } from "../shared/useLiveScore";
import type { ProductID, PMFScore } from "@domain-model";

let cacheKey = "";
const cacheMap = new Map<
  ProductID,
  {
    PMFScore: PMFScore;
    reliability:
      | "Very reliable"
      | "Reliable"
      | "Somewhat reliable"
      | "Less reliable";
  }
>();

/**
 * Composable for loading PMF Live Score with cache.
 */
export async function useCacheableLiveScore(productID: ProductID, key: string) {
  // Clear cache map and update cache key if cache key is now different
  if (cacheKey !== key) {
    cacheMap.clear();
    cacheKey = key;
  }

  const cachedValue = cacheMap.get(productID);

  if (cachedValue === undefined) {
    const liveScore = await useLiveScore(productID);
    cacheMap.set(productID, liveScore);
    return liveScore;
  }

  return cachedValue;
}
