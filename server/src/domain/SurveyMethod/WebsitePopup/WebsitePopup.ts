import type { SurveyMethod } from '../SurveyMethod.js';

export const WebsitePopup: SurveyMethod = {
  id: 'website-popup',
  name: 'Website Popups with our SDK',
  productTypes: ['Software as a Service (SaaS)'],
  productExamples: ['Spotify', 'Netflix', 'Instagram'],
  usecase: [
    'You want to survey your customers automatically via a pop up on your website.',
    'Use this for a quick feedback loop cycle, especially helpful for active product development.',
  ],
  descriptions: [
    'Once set up, this will automatically survey your customers who visit your website, without your intervention.',
    'All you need to do is improve your product based on the actionable insights and monitor your PMF Score over time.',
  ],
};
