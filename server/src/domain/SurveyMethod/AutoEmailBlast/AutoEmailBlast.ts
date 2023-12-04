import type { SurveyMethod } from '../SurveyMethod.js';

export const AutoEmailBlast: SurveyMethod = {
  unimplemented: true,

  id: 'email-auto',
  name: 'Automatic Email Blasts',
  productTypes: ['Software as a Service (SaaS)'],
  productExamples: ['Spotify', 'Netflix', 'Instagram'],
  usecase: [
    "You want to survey customers automatically in a recurring manner, e.g. by following your product's sprint cycles.",
    'You want to get quick feedback every time you make improvement to your product.',
  ],
  descriptions: [
    'You will need to either do a one-off system integration to automatically upload your customers emails continuously or manually upload them reguarly.',
    'Once set up, this will automatically send out surveys for you without your intervention at your selected automatic surveying rate.',
    'All you need to do is improve your product based on the actionable insights and monitor your PMF Score over time.',
  ],
};
