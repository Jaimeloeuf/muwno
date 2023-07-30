import { ref } from "vue";
import { sf } from "simpler-fetch";
import type {
  ReadOneFeedbackFormDTO,
  CreateOneFeedbackResponseDTO,
} from "domain-model";

/**
 * Composable for handling the feedback form.
 */
export async function useForm(formID: string) {
  const { res, err } = await sf
    .useDefault()
    .GET(`/feedback/form/${formID}`)
    .runJSON<ReadOneFeedbackFormDTO>();

  if (err) throw err;
  if (!res.ok) throw new Error("Failed to load feedback form!");

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
    /* Input validation */
    if (a1.value === undefined) return false;

    const { res, err } = await sf
      .useDefault()
      .POST(`/feedback/submit/${formID}`)
      .bodyJSON<CreateOneFeedbackResponseDTO>({
        response: {
          a1: a1.value,
          a2: a2.value,
          a3: a3.value,
          a4: a4.value,
        },
      })
      .run();

    if (err) throw err;
    if (!res.ok) throw new Error("Failed to submit response!");

    return true;
  }

  return { productName, radioOptions, a1, a2, a3, a4, submitForm };
}
