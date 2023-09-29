import type { SurveyMethod } from '../SurveyMethod.js';

export const AutoSmsBlast: SurveyMethod = {
  unimplemented: true,

  id: 5,
  name: 'Automatic SMS Blasts',
  productTypes: ['Software as a Service (SaaS)'],
  productExamples: ['Spotify', 'Netflix', 'Instagram'],
  usecase: [
    'You want to survey your customers automatically and recurringly via SMS blasts.',
  ],
  descriptions: [
    'You will need to either do a one-off system integration to automatically upload your customers phone numbers continuously or manually upload them reguarly.',
    'Once set up, this will automatically send out surveys for you without your intervention at your selected automatic surveying rate.',
    'All you need to do is improve your product based on the actionable insights and monitor your PMF Score over time.',
  ],
};
