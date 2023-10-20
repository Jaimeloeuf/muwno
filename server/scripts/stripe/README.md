# server/scripts/stripe
This folder contains the script to setup Stripe.

This will create all the required products and prices so that it is always consistent across redeployments, new accounts and migrating between test and live mode.

Make sure you have `STRIPE_SECRET_KEY` ready to key into the CLI when prompted for it..


## Run the CLI tool
Use the provided npm script.
```sh
npm run stripe:setup
```


## Use custom Stripe Indempotency Key prefix
If no arg is used, `cli-setup-idempotent-key` will be used as the default indempotency key prefix.
```sh
npm run stripe:setup
```

Pass a custom key prefix
```sh
npm run stripe:setup ik=key-prefix
```


## To run script without Indempotency
Use this to run the entire script without any indempotency. Make sure you do not run this more than once.
```sh
npm run stripe:setup noik
```

This is mainly used since requests cannot be deleted/cleared and you have to wait for the time to rollover for the request to work again when using the same indempotency key.

See <https://stripe.com/docs/api/idempotent_requests>