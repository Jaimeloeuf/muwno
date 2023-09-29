/**
 * Type to represent a single Survey Method.
 */
export type SurveyMethod = {
  /**
   * Should either be unset or `true`.
   * Set to true when the SurveyMethod is not implemented yet.
   */
  unimplemented?: boolean;

  /**
   * Unique ID for this survey method, since there is only a fixed number of
   * survey methods and they are all defined in domain/.
   */
  id: number;

  /**
   * This is the name of the survey method that users will see
   */
  name: string;

  /**
   * Product Types/Categories that suit this survey method.
   */
  productTypes: Array<string>;

  /**
   * A list of well known products that belong in the specified product type /
   * category so that users can reference it to know if their own product lies
   * in the same product category.
   */
  productExamples: Array<string>;

  /**
   * A list of use cases for this survey method, i.e. what type of use case you
   * should be thinking off when using this method.
   */
  usecase: Array<string>;

  /**
   * A list of descriptions for this survey method to describe how this survey
   * method works so you can kind of imagine how you will be using it.
   */
  descriptions: Array<string>;
};

/**
 * Type alias for `SurveyMethod['id']` where all surveyMethodIDs will follow the
 * same type.
 */
export type SurveyMethodID = SurveyMethod['id'];
