import z from 'zod';
import type { Survey } from './SurveyValidator';

/**
 * Function to generate an array of Zod parsers, where a unique parser
 * is dynamically configured for each of the Survey Questions.
 */
function generateQuestionValidators(ques: Survey['ques']) {
  return ques.map((ques) => {
    switch (ques.type) {
      case 'short-text':
      case 'long-text':
        // @todo How to validate length on the optional answer parser?
        ques.charLimit;

        return ques.optional === true
          ? z.string().optional()
          : z.string().nonempty();

      // Validate option choice, rather than the full text answer itself
      case 'option':
        // If there are 3 options, the possible answers are, 1, 2 and 3.
        // positive forces it to be bigger than 0
        // lte to ensure that it is less than or equals to 3
        return z.number().positive().lte(ques.options.length);

      case 'checkbox':
        return z.boolean();

      default:
        throw new Error(`Invalid Ques Type`);
    }
  });
}

/**
 * Dynamically generate a new `Zod` based validator to validate survey
 * answers based on the given survey schema.
 *
 * Why FF pattern?
 * FF pattern is used so that this validator can be reused, instead of
 * generating a new validator for every single answer validation request.
 */
export function generateSurveyAnswerValidator(survey: Survey) {
  // Create a input validation parser using a feedback schema
  const inputValidators = generateQuestionValidators(survey.ques);

  /**
   * The actual validator function that will validate the array of answers.
   * @throws an error if the number of answers given does not match number of questions
   * @throws Zod errors if any of the answer fails validation
   */
  return function validator(answers: Array<unknown>) {
    if (answers.length !== inputValidators.length)
      throw new Error(
        `Number of answers does not match number of questions! Ans:${answers.length} - Ques:${survey.ques.length}`,
      );

    // Parse and validate each of the answers using the corresponding question's parser
    // Any errors here will be thrown here as a `ZodError`
    // for (let i = 0; i < answers.length; i++)
    //   inputValidators[i]?.parse(answers[i]);
    //
    // answers.forEach((answer, index) =>
    // // Should this be safe parse? Or should somehow let the error bubble up
    // inputValidators[index]?.safeParse(answer),
    // );
    //
    answers.forEach((answer, index) => inputValidators[index]?.parse(answer));

    return true;
  };
}
