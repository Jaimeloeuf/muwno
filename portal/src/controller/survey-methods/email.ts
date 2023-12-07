import { sf } from "simpler-fetch";
import { getAuthHeader } from "../../firebase";
import type { ProductID, CreateManualEmailBlastDTO } from "@domain-model";

export async function manualEmailBlast(
  productID: ProductID,
  data: CreateManualEmailBlastDTO["customers"]
) {
  const { res, err } = await sf
    .useDefault()
    .POST(`/survey-method/email/manual/blast/${productID}`)
    .bodyJSON<CreateManualEmailBlastDTO>({ customers: data })
    .useHeader(getAuthHeader)
    .runJSON<{ success: boolean }>();

  if (err) throw err;
  if (!res.ok || !res.data.success)
    throw new Error(`Failed to email customers: ${JSON.stringify(res)}`);
}
