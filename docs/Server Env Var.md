# Server Env Var
This documents all the environment variables required by [server](../server/)


## Env Vars
| Variable              | Description                                                                                                                | Default Value (if any) |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| GCP                   | Only set this to `true` when running service in Google Cloud Platform to use GCP's ADC. (See [GCP ADC](./GCP%20ADC.md))    |                        |
| NODE_ENV              | NODE_ENV String used by Node build tools.                                                                                  | development            |
| version               | A string made with build time git branch and commit hash.                                                                  | DEBUG_MODE_VERSION     |
| RECAPTCHA_SECRET      | Recaptcha secret key.                                                                                                      |                        |
| POSTMARK_API_KEY      | POSTMARK Email Service API key.                                                                                            |                        |
| OPENAI_API_KEY        | API key to access OpenAI's API.                                                                                            |                        |
| OPENAI_ORG            | OpenAI Org ID to know which Org does usage of OpenAI API count towards with the `OPENAI_API_KEY`.                          |                        |
| STRIPE_SECRET_KEY     | Stripe's Secret Key                                                                                                        |                        |
| STRIPE_WEBHOOK_SECRET | Stripe's Webhook Secret                                                                                                    |                        |
| STRIPE_WEBHOOK_PATH   | Stripe's Webhook Path Secret used as a simple way to ensure that the caller is actually Stripe by knowing the secret path. |                        |
| TELE_BOT_TOKEN        | Telegram bot's token.                                                                                                      |                        |
| TELE_ADMIN_CHAT_ID    | Chat ID of the team's telegram admin chat for notifications.                                                               |                        |
| THROTTLE_TTL          | Default Time To Live (TTL) value in milliseconds for throttler.                                                            | 3000                   |
| THROTTLE_LIMIT        | Default max limit of requests within each `THROTTLE_TTL` period.                                                           | 150                    |
| PRISMA_VERBOSE        | Flag to enable Prisma's verbose mode.                                                                                      | false                  |
