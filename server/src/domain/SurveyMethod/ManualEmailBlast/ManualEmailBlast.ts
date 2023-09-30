import type { SurveyMethod } from '../SurveyMethod.js';

export const ManualEmailBlast: SurveyMethod = {
  unimplemented: true,

  id: 1,
  name: 'Manual Email Blasts',
  productTypes: ['Software as a Service (SaaS)', 'Physical Product or Service'],
  productExamples: ['Spotify', 'Netflix', 'Instagram'],
  usecase: [
    'You want to do one off email blasts.',
    "You have your customers' emails but do not want to automatically and recurringly survey them.",
  ],
  descriptions: [
    "You can do one-off email survey blasts by manually uploading your customers' email.",
  ],
};
