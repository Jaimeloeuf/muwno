import { ref } from "vue";
import { sf } from "simpler-fetch";
import { getRecaptchaToken } from "../utils/recaptcha";
import type {
  ReadOneFeedbackFormDTO,
  CreateOneFeedbackResponseDTO,
} from "@domain-model";

/**
 * Composable for handling PMF Survey Forms.
 */
export async function usePmfSurvey(formID: string) {
  const { res, err } = await sf
    .useDefault()
    .GET(`/feedback/form/${formID}`)
    .useHeader({
      "x-recaptcha-token": await getRecaptchaToken("getFormDetails"),
    })
    .runJSON<
      ReadOneFeedbackFormDTO,
      { error: string; message: string; statusCode: number }
    >();

  if (err) throw err;

  if (!res.ok) {
    if (
      res.status === 401 &&
      res.data.message.toLowerCase().includes("recaptcha")
    )
      throw new Error(
        "😅 Oops, Google's recaptcha thinks that you are a dangerous robot, please try again later?"
      );
    if (res.status === 404) throw new Error("404, Invalid feedback form link");

    throw new Error("Failed to load feedback form!");
  }

  const productName = res.data.form.productName;

  const radioOptions = [
    { value: 3, text: "Very" },
    { value: 2, text: "Somewhat" },
    { value: 1, text: "Not" },
  ];

  // Answer variables
  const a1 = ref<number | undefined>(undefined);
  const a2 = ref<string>("");
  const a3 = ref<string>("");
  const a4 = ref<string>("");

  async function submitForm() {
    const { res, err } = await sf
      .useDefault()
      .POST(`/feedback/submit/${formID}`)
      .useHeader({
        "x-recaptcha-token": await getRecaptchaToken("submitFeedbackForm"),
      })
      .bodyJSON<CreateOneFeedbackResponseDTO>({
        // Type cast here is safe because the caller should do input validation
        // for `a1` before calling this function since this function will not be
        // awaited for by the caller so it cannot rely on this function to check.
        a1: a1.value as 1 | 2 | 3,
        a2: a2.value,
        a3: a3.value,
        a4: a4.value,
      })
      .runVoid((res) => res.json());

    // Since not throwing any errors to keep users on the happy path towards the
    // submitted response page to thank them, this just logs out all details in
    // case it is needed for debugging directly in devtools.
    if (err) console.error(`Submission failed`, err);
    else if (!res.ok) console.error(`Submission failed`, res);
    else console.log("Response submitted");
  }

  return { productName, radioOptions, a1, a2, a3, a4, submitForm };
}
