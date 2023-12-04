import type { SurveyMethod } from './SurveyMethod.js';

import { FeatureGating } from './FeatureGating/FeatureGating.js';
import { ManualEmailBlast } from './ManualEmailBlast/ManualEmailBlast.js';
import { WebsitePopup } from './WebsitePopup/WebsitePopup.js';
import { AutoEmailBlast } from './AutoEmailBlast/AutoEmailBlast.js';
import { ManualSmsBlast } from './ManualSmsBlast/ManualSmsBlast.js';
import { AutoSmsBlast } from './AutoSmsBlast/AutoSmsBlast.js';

/**
 * Re-export all of this
 */
export {
  FeatureGating,
  ManualEmailBlast,
  WebsitePopup,
  AutoEmailBlast,
  ManualSmsBlast,
  AutoSmsBlast,
};

/**
 * A mapping of `SurveyMethod['id']` to `SurveyMethod`
 */
export const SurveyMethods = {
  [FeatureGating.id]: FeatureGating,
  [ManualEmailBlast.id]: ManualEmailBlast,
  [WebsitePopup.id]: WebsitePopup,
  [AutoEmailBlast.id]: AutoEmailBlast,
  [ManualSmsBlast.id]: ManualSmsBlast,
  [AutoSmsBlast.id]: AutoSmsBlast,
};

/**
 * Array of all the survey methods in a fixed order to show users.
 */
export const SurveyMethodsArray: Array<SurveyMethod> = [
  FeatureGating,
  ManualEmailBlast,
  WebsitePopup,
  AutoEmailBlast,
  ManualSmsBlast,
  AutoSmsBlast,
];
