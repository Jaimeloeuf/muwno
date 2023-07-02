import { ref } from "vue";

/**
 * Composable for handling the feedback form.
 */
export async function useForm(formID: string) {
  // @todo Load form asynchronously from API

  const productName = "Superhuman";

  const radioOptions = ["Very", "Somewhat", "Not"];

  // Answer variables
  const a1 = ref<number | undefined>(undefined);
  const a2 = ref<string>("");
  const a3 = ref<string>("");
  const a4 = ref<string>("");

  async function submitForm() {
    // @todo Show loader

    if (a1.value === undefined) return false;

    // @todo Call API
    console.log({
      a1: a1.value,
      a2: a2.value,
      a3: a3.value,
      a4: a4.value,
    });

    return true;
  }

  return { productName, radioOptions, a1, a2, a3, a4, submitForm };
}
