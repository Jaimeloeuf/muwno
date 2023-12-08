import { ref } from "vue";
import { isLinkValidReactive } from "../utils/isLinkValid";
import { getReactiveSurveyLinkWithRedirect } from "../utils/getSurveyLink";
import type { ProductID } from "@domain-model";

export function useFormLinks(productID: ProductID) {
  /**  */
  const redirectLink = ref("");

  const isRedirectLinkValid = isLinkValidReactive(redirectLink);

  const surveyLink = getReactiveSurveyLinkWithRedirect(
    productID,
    isRedirectLinkValid,
    redirectLink
  );

  // expose managed state as return value
  return { redirectLink, isRedirectLinkValid, surveyLink };
}
