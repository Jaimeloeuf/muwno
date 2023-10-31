/**
 * A list of hardcoded strings that means no feedback.
 *
 * Defined here instead of inlining it to ensure this array is only created once.
 */
export const listOfNoFeedbackStrings = [
  '',
  'nothing',
  'no',
  'na',
  'nil',
  '-nil',
  '-nil-',
  'no feedback',
  'test',
  'testing',
];

/**
 * The length of the longest string in the list of hardcoded no feedback strings.
 *
 * Calculate this once on startup to ensure that this is not calculated every
 * time to reduce unnecessary compute as the array does not change.
 */
export const listOfNoFeedbackStringsMaxLength = Math.max(
  ...listOfNoFeedbackStrings.map((str) => str.length),
);
