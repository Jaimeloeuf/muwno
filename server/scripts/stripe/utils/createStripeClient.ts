import Stripe from 'stripe';

export async function createStripeClient(STRIPE_SECRET_KEY: string) {
  return new Stripe(STRIPE_SECRET_KEY, {
    // API Version is hardcoded as updating this will usually require code
    // update and is not just a configuration change.
    apiVersion: '2023-10-16',

    // For support and debugging
    appInfo: {
      name: `muwno-cli-setup-script`,
      url: 'https://github.com/Jaimeloeuf/muwno',
    },
  });
}
