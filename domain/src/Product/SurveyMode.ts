/**
 * Enum to represent all possible Survey Modes.
 */
export enum SurveyMode {
  auto = 1,
  manual = 2,
}

/**
 * Type to represent a single Survey Mode Description object.
 */
export type SurveyModeDescription = {
  /**
   * Unique ID for this survey mode, since there is only a fixed number of
   * survey modes now, the values are hard coded numeric literal values on
   * `SurveyMode` enum.
   */
  id: SurveyMode;

  /**
   * This is the name of the survey mode that users will see
   */
  name: string;

  /**
   * Name of the Product Type/Category that should be using this survey mode.
   */
  productType: string;

  /**
   * A list of well known products that belong in the specified product type /
   * category so that users can reference it to know if their own product lies
   * in the same product category.
   */
  productExamples: Array<string>;

  /**
   * A list of use cases for this survey mode, i.e. what type of use case you
   * should be thinking off when using this mode.
   */
  usecase: Array<string>;

  /**
   * A list of descriptions for this survey mode to describe how this survey
   * mode works so you can kind of imagine how you will be using this product.
   */
  descriptions: Array<string>;
};
