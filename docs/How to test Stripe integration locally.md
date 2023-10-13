# How to test Stripe integration locally
Install [stripe](https://www.npmjs.com/package/stripe) library locally first.


## Listen to webhook events locally
Run npm script to setup a forwarding service to the locally running server.
```sh
npm run stripe:listen
```

Example on creating and triggering this fake events of the given type to have it forwarded to the local server.
```sh
cls; stripe trigger invoice.paid
cls; stripe trigger setup_intent.succeeded
```


## Cards
These are some of the test cards. The other values can be any random value. These cards only work when using the test publishable key in Stripe's test mode.

Card for testing that do not require 3DS
```
4242424242424242
```

Card for testing that always requires 3DS
```
4000002500003155
```