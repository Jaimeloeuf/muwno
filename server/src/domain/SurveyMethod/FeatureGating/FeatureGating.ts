import type { SurveyMethod } from '../SurveyMethod.js';

export const FeatureGating: SurveyMethod = {
  id: 'feature-gating',
  name: 'Feature Gating',
  productTypes: ['Software as a Service (SaaS)'],
  productExamples: ['Spotify', 'Netflix', 'Instagram'],
  usecase: [
    'You want to automatically survey your customers recurringly at fixed time intervals (e.g. automatically survey users once a month).',
    'You want a quick feedback loop cycle, especially helpful for active product development.',
  ],
  descriptions: [
    'Once set up, this will automatically survey your customers who visit your application or use a feature recurringly at fixed time intervals.',
    'All you need to do is improve your product based on the actionable insights and monitor your PMF Score over time.',
  ],
};
