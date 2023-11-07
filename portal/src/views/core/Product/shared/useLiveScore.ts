import { sf } from "simpler-fetch";
import { getAuthHeader } from "../../../../firebase";
import type { ProductID, ReadOnePMFScoreDTO } from "@domain-model";

function getReliability(totalResponses: number) {
  if (totalResponses >= 100) return "Very reliable" as const;
  else if (totalResponses < 100 && totalResponses >= 35)
    return "Reliable" as const;
  else if (totalResponses < 35 && totalResponses >= 10)
    return "Somewhat reliable" as const;
  else return "Less reliable" as const;
}

/**
 * Composable for loading PMF Live Score.
 */
export async function useLiveScore(productID: ProductID) {
  const { res, err } = await sf
    .useDefault()
    .GET(`/pmf/live/${productID}`)
    .useHeader(getAuthHeader)
    .runJSON<ReadOnePMFScoreDTO>();

  if (err) throw err;
  if (!res.ok) throw new Error("Failed to load PMF live score!");

  const PMFScore = res.data.score;

  const reliability = getReliability(PMFScore.totalResponses);

  return { PMFScore, reliability };
}
