import { type Survey, validateSurvey } from './SurveyValidator';
import { generateSurveyAnswerValidator } from './QuestionValidator';
import { type SurveyResponse, validateResponse } from './ResponseValidator';

// This is stored in the DB
export const sampleSurvey: Survey = {
  schemaVersion: '1',

  // base on this look, everything can be in SQL cols except ques which will be a jsonb
  // and thats fine anyways since it is not going to be indexed
  id: '123',
  idOfPreviousVersion: undefined,
  createdAt: new Date().toISOString(),
  createdBy: 'superhuman@gmail.com or some userID',
  ownedBy: 'superhuman-ownerID',
  title: 'Super Human feedback form',
  ques: [
    {
      type: 'option',
      ques: 'How would you feel if you could no longer use the product?',
      optional: false,
      options: [
        'Very disappointed',
        'Somewhat disappointed',
        'Not disappointed',
      ],
    },
    {
      type: 'long-text',
      ques: 'What type of people do you think would most benefit from Superhuman?',
      optional: true,
      charLimit: 1000,
    },
    {
      type: 'long-text',
      ques: 'What is the main benefit you receive from Superhuman?',
      optional: true,
      charLimit: 1000,
    },
    {
      type: 'long-text',
      ques: 'How can we improve Superhuman for you?',
      optional: true,
      charLimit: 1000,
    },
  ],
};

/**
 * With other metadata too, such as WHICH survey is this responding too...
 */
const sampleResponse: SurveyResponse = {
  schemaVersion: '1',
  id: '1',
  // @todo Validate this
  surveyID: 'gh9si3',
  createdAt: new Date().toISOString(),
  createdBy: 'SOME_USER_ID??',

  ans: [
    1,
    // If there is an optional question, then this will be a sparse array
    // it must keep the undefined value here.
    'Founders and people who value speed of getting email done',
    'being able to move faster and spend less time in email',
    'I would like to have a better notification system, something like a batch notification one shot send me all',
  ],
};

// If i want to do analytics
// I need to read all the answer arrays from DB with `SELECT ans FROM survey_response WHERE surveyID = 'gh9si3' AND createdAt > 123 AND createdAt < 234`
// The query will give me back one chunk of data that i need to process
// so right now I can hardcode the array position, where it will just be index 0
// so do a map operation on it?
// map all answer arrays into a single

// Method 2: Rely on SQL engine with a fixed survey format
// SELECT AVG(option) FROM survey_response WHERE surveyID = 'gh9si3' AND createdAt > 123 AND createdAt < 234
// The main diff is that the SQL engine does the average computation for us, the value is literally wat we return to the frontend directly from the query
// Whereas the more generic storage method requires us to load all data to compute it before returning it

// The operations for validating the above sample data
{
  console.log('Survey Validation Result', validateSurvey(sampleSurvey));

  //  ------------------------------------------------------------------

  console.log(
    'Response Validation Result',
    validateResponse(sampleResponse, ''),
  );

  const validator = generateSurveyAnswerValidator(sampleSurvey);
  console.log('Answer Validation Result', validator(sampleResponse.ans));
}
