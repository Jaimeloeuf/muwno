import type { SurveyMethod } from "./SurveyMethod.js";

import { ManualEmailBlast } from "./ManualEmailBlast/ManualEmailBlast.js";
import { AutoEmailBlast } from "./AutoEmailBlast/AutoEmailBlast.js";
import { WebsitePopup } from "./WebsitePopup/WebsitePopup.js";
import { ManualSmsBlast } from "./ManualSmsBlast/ManualSmsBlast.js";
import { AutoSmsBlast } from "./AutoSmsBlast/AutoSmsBlast.js";

/**
 * A mapping of `SurveyMethod['id']` to `SurveyMethod`
 */
export const SurveyMethods = {
  [ManualEmailBlast.id]: ManualEmailBlast,
  [AutoEmailBlast.id]: AutoEmailBlast,
  [WebsitePopup.id]: WebsitePopup,
  [ManualSmsBlast.id]: ManualSmsBlast,
  [AutoSmsBlast.id]: AutoSmsBlast,
};

/**
 * Array of all the survey methods in a fixed order to show users.
 */
export const SurveyMethodsArray: Array<SurveyMethod> = [
  ManualEmailBlast,
  AutoEmailBlast,
  WebsitePopup,
  ManualSmsBlast,
  AutoSmsBlast,
];
