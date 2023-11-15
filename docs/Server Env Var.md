# Server Env Var
This documents all the environment variables required by [server](../server/)


## Env Vars
- `Required`: If the value is required to run the server.
- `Default`: If there is a default hardcoded value. If there is a default value and the variable is required, you do not have to set it.

| Variable                    | Description                                                                                                                | Required                                 | Default Value (if any)  |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- | ----------------------- |
| GCP                         | Only set this to `true` when running service in Google Cloud Platform to use GCP's ADC. (See [GCP ADC](./GCP%20ADC.md))    | false                                    |                         |
| NODE_ENV                    | NODE_ENV String used by Node build tools.                                                                                  | true                                     | development             |
| version                     | A string made with build time git branch and commit hash.                                                                  | true                                     | DEBUG_MODE_VERSION      |
| RECAPTCHA_SECRET            | Recaptcha secret key.                                                                                                      | true                                     |                         |
| POSTMARK_API_KEY            | POSTMARK Email Service API key.                                                                                            | true (only if NODE_ENV === 'production') |                         |
| EMAIL_TRANSACTIONAL_ADDRESS | Email Address used for transactional emails.                                                                               | true                                     | robot@muwno.com         |
| EMAIL_TRANSACTIONAL_REPLY   | Email Address used for user replies to transactional emails.                                                               | true                                     | help@muwno.com          |
| EMAIL_BLAST_ADDRESS         | Email Address used for survey email blasts.                                                                                | true                                     | survey-blasts@muwno.com |
| EMAIL_BLAST_REPLY           | Email Address used for user replies to email blast emails.                                                                 | true                                     | help@muwno.com          |
| OPENAI_API_KEY              | API key to access OpenAI's API.                                                                                            | true                                     |                         |
| OPENAI_ORG                  | OpenAI Org ID to know which Org does usage of OpenAI API count towards with the `OPENAI_API_KEY`.                          | true                                     |                         |
| STRIPE_SECRET_KEY           | Stripe's Secret Key                                                                                                        | true                                     |                         |
| STRIPE_WEBHOOK_SECRET       | Stripe's Webhook Secret                                                                                                    | true                                     |                         |
| STRIPE_WEBHOOK_PATH         | Stripe's Webhook Path Secret used as a simple way to ensure that the caller is actually Stripe by knowing the secret path. | true                                     |                         |
| TELE_BOT_TOKEN              | Telegram bot's token.                                                                                                      | false                                    |                         |
| TELE_ADMIN_CHAT_ID          | Chat ID of the team's telegram admin chat for notifications.                                                               | false                                    |                         |
| THROTTLE_TTL                | Default Time To Live (TTL) value in milliseconds for throttler.                                                            | true                                     | 3000                    |
| THROTTLE_LIMIT              | Default max limit of requests within each `THROTTLE_TTL` period.                                                           | true                                     | 150                     |
| PRISMA_VERBOSE              | Flag to enable Prisma's verbose mode.                                                                                      | true                                     | false                   |
