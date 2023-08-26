import path from 'path';
import dotenv from 'dotenv';
import Stripe from 'stripe';

export async function createStripeClient() {
  const envArgv =
    process.argv.find((argv) => new RegExp(/env=\w+/g).test(argv)) ??
    'env=development';

  const env = envArgv.split('=')[1];

  if (env !== 'development' && env !== 'production')
    throw new Error(
      `'env=' must be either 'development' or 'production'. Found ${env}`,
    );

  const stripeCredentialEnvFilePath = path.resolve(
    process.cwd(),
    `.env.${env}`,
  );

  console.log(`Loading Stripe credentials from ${stripeCredentialEnvFilePath}`);

  dotenv.config({ path: stripeCredentialEnvFilePath });

  if (process.env['STRIPE_SECRET_KEY'] === undefined)
    throw new Error('Missing Stripe Secret Key');

  return new Stripe(
    process.env['STRIPE_SECRET_KEY'],

    {
      // API Version is hardcoded as updating this will usually require code
      // update and is not just a configuration change.
      apiVersion: '2023-08-16',

      // For support and debugging
      appInfo: {
        name: `thepmftool-cli-setup-script`,
        url: 'https://github.com/Jaimeloeuf/thepmftool',
      },
    },
  );
}
