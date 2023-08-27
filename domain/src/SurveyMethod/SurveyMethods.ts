import type { SurveyMethod } from "./SurveyMethod.js";

import { ManualEmailBlast } from "./ManualEmailBlast/ManualEmailBlast.js";

/**
 * A mapping of `SurveyMethod['id']` to `SurveyMethod`
 */
export const SurveyMethods = {
  [ManualEmailBlast.id]: ManualEmailBlast,
};

/**
 * Array of all the survey methods in a fixed order to show users.
 */
export const SurveyMethodsArray: Array<SurveyMethod> = [
  ManualEmailBlast,
];
