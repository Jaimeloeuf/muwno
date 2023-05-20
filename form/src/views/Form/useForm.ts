import type { SurveyResponse } from "../../../../server/src/survey/ResponseValidator";

/**
 * Composable for handling forms.
 */
export async function useForm(formID: string) {
  // @todo Load form asynchronously from API instead
  const { survey: form } = await import("./SampleSurvey");

  async function submitForm(data: Record<string, any>) {
    const answerArray= new Array(form.ques.length);

    for (const [quesID, ans] of Object.entries(data)) {
      // Add test (either regex or smth safer) to ensure `_q` prefix is found
      // making sure that it is really a answer for a question and not some
      // other random data from FormKit.
      const quesIndex = parseInt(quesID.replace("_q", ""));
      answerArray[quesIndex] = ans;
    }

    // Temporary fake data
    const response: SurveyResponse = {
      schemaVersion: "1",
      id: "1",
      surveyID: formID,
      createdAt: new Date().toISOString(),
      createdBy: "SOME_USER_ID",
      ans: answerArray,
    };

    console.log(response);
  }

  return { form, submitForm };
}
