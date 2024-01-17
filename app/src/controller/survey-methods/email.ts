import { sf } from "simpler-fetch";
import { getAuthHeader, prettyJSON } from "../../utils";
import type { ProductID, CreateManualEmailBlastDTO } from "@domain-model";

export async function manualEmailBlast(
  productID: ProductID,
  customers: CreateManualEmailBlastDTO["customers"],
  redirectLink: CreateManualEmailBlastDTO["redirectLink"]
): Promise<Error | void> {
  const { res, err } = await sf
    .useDefault()
    .POST(`/survey-method/email/manual/blast/${productID}`)
    .bodyJSON<CreateManualEmailBlastDTO>({ customers, redirectLink })
    .useHeader(getAuthHeader)
    .runJSON<{ success: boolean }>();

  if (err) return err;
  if (!res.ok || !res.data.success)
    return new Error(`Failed to email customers: ${prettyJSON(res)}`);
}
