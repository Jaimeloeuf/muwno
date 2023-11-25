import { sf } from "simpler-fetch";
import { getAuthHeader } from "../firebase";
import type {
  ProductID,
  FeedbackResponseID,
  ReadManyA3DTO,
} from "@domain-model";

export class BenefitController {
  static async getBenefits(
    productID: ProductID,
    count: number,
    paginationID?: FeedbackResponseID
  ) {
    const { res, err } = await sf
      .useDefault()
      .GET(`/feedback/response/a3/${productID}`)
      .useQuery({ count: count.toString(), paginationID })
      .useHeader(getAuthHeader)
      .runJSON<ReadManyA3DTO>();

    if (err) throw err;
    if (!res.ok)
      throw new Error(`Failed to get Benefits: ${JSON.stringify(res)}`);

    return res.data.benefits;
  }
}
