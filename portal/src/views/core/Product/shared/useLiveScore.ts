import { sf } from "simpler-fetch";
import { getAuthHeader } from "../../../../firebase";
import type { ProductID, ReadOnePMFScoreDTO } from "@domain-model";

function getReliability(totalResponses: number) {
  if (totalResponses >= 40) return "Very reliable" as const;
  else if (totalResponses < 40 && totalResponses >= 30)
    return "Reliable" as const;
  else if (totalResponses < 30 && totalResponses >= 15)
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
