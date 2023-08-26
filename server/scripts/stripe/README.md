# server/scripts/stripe
This folder contains the script to setup Stripe.

This will create all the required products and prices so that it is always consistent across redeployments, new accounts and migrating between test and live mode.

Make sure `STRIPE_SECRET_KEY` is set in the appropriate .env file, and run the command below to run the script with the credential from the specified file.


## Expected input from CLI command
Setup stripe using the Stripe credentials in [.env.development](../../.env.development) file. Defaults to `development` without any inputs.
```sh
npm run stripe:setup
```

Setup stripe using the Stripe credentials in [.env.development](../../.env.development) file.
```sh
npm run stripe:setup env=development
```

Setup stripe using the Stripe credentials in [.env.production](../../.env.production) file.
```sh
npm run stripe:setup env=production
```