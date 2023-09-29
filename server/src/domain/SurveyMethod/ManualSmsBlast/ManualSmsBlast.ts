import type { SurveyMethod } from '../SurveyMethod.js';

// This is the format to support for phone numbers
// https://en.wikipedia.org/wiki/E.164

export const ManualSmsBlast: SurveyMethod = {
  unimplemented: true,

  id: 4,
  name: 'Manual SMS Blasts',
  productTypes: ['Software as a Service (SaaS)', 'Physical Product or Service'],
  productExamples: ['Spotify', 'Netflix', 'Instagram'],
  usecase: [
    'You want to do one-off SMS blasts.',
    "You have your customers' phone numbers but do not want to automatically and recurringly survey them",
  ],
  descriptions: [
    "Upload your customers' phone numbers for one-off SMS blasts.",
  ],
};
