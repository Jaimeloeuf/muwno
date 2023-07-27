import type { Product, SurveyMode } from "../Product/index.js";

/**
 * DTO data used to create a single Product.
 */
export type CreateOneProductDTO = {
  name: Product["name"];
  surveyMode: SurveyMode;
};
