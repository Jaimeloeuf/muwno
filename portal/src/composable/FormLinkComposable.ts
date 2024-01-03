import { ref, computed } from "vue";
import { isLinkValidReactive, getSurveyLink } from "../utils";
import type { ProductID } from "@domain-model";

/**
 * Composable to manage form redirectLink and the survey link itself.
 */
export function useFormLinks(productID: ProductID) {
  /**
   * Redirect link for user to set through 2 way binded inputs.
   */
  const redirectLink = ref("");

  const isRedirectLinkValid = isLinkValidReactive(redirectLink);

  /**
   * `surveyLink` only includes the redirect link if it is valid.
   */
  const surveyLink = computed(
    () =>
      `${getSurveyLink(productID)}${
        isRedirectLinkValid.value
          ? `?redirect=${encodeURIComponent(redirectLink.value)}`
          : ""
      }`
  );

  return { redirectLink, isRedirectLinkValid, surveyLink };
}
