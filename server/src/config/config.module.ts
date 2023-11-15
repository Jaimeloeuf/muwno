import { ConfigModule as _ConfigModule } from '@nestjs/config';

// Cannot be converted to a default import as joi does not properly exports it
import * as Joi from 'joi';

import type { JoiEnvVarValidationSchema } from './types.js';

/**
 * `ConfigModule` created by configuring '@nestjs/config'
 *
 * Reference: https://docs.nestjs.com/modules
 */
export const ConfigModule = _ConfigModule.forRoot({
  /**
   * Register ConfigModule in the global scope so that every other module that
   * requires the ConfigModule does not need to manually import this repeatedly.
   */
  isGlobal: true,

  /**
   * From NestJS docs: Accessing process.env can be slow, caching it can
   * increase performance of `ConfigService.get` method for getting variables
   * stored in process.env
   */
  cache: true,

  /**
   * Use Joi to ensure that all environment variables are required and defined
   */
  validationSchema: Joi.object({
    /**
     * Expect `NODE_ENV` to be a standard value. Defaults to 'development'
     */
    NODE_ENV: Joi.string()
      .valid('development', 'production', 'test')
      .default('development'),

    /**
     * Expect `version` to be a string made with build time git branch and
     * commit hash.
     */
    version: Joi.string().default('DEBUG_MODE_VERSION'),

    /**
     * Expects the Recaptcha secret key.
     */
    RECAPTCHA_SECRET: Joi.string().required(),

    /**
     * Expects the POSTMARK Email Service API key.
     * This is optional for development environments as it will be mocked.
     */
    POSTMARK_API_KEY: Joi.string().optional(),

    /**
     * Expects the email address used for transactional emails.
     */
    EMAIL_TRANSACTIONAL_ADDRESS: Joi.string()
      .email()
      .default('robot@muwno.com'),

    /**
     * Expects the email address for user replies to transactional emails.
     */
    EMAIL_TRANSACTIONAL_REPLY: Joi.string().email().default('help@muwno.com'),

    /**
     * Expects the email address used for survey email blasts.
     */
    EMAIL_BLAST_ADDRESS: Joi.string()
      .email()
      .default('survey-blasts@muwno.com'),

    /**
     * Expects the email address for user replies to email blast emails.
     */
    EMAIL_BLAST_REPLY: Joi.string().email().default('help@muwno.com'),

    /**
     * Expects the API key to access OpenAI's API.
     */
    OPENAI_API_KEY: Joi.string().required(),

    /**
     * Expects the OpenAI Org ID.
     */
    OPENAI_ORG: Joi.string().required(),

    /**
     * Expects a Stripe Secret Key.
     */
    STRIPE_SECRET_KEY: Joi.string().required(),

    /**
     * Expects a Stripe Webhook Secret.
     */
    STRIPE_WEBHOOK_SECRET: Joi.string().required(),

    /**
     * Expects a Stripe Webhook Path Secret.
     */
    STRIPE_WEBHOOK_PATH: Joi.string().required(),

    /**
     * Expects the telegram bot's token.
     * This is optional for development environments as it will be mocked.
     */
    TELE_BOT_TOKEN: Joi.string().optional(),

    /**
     * Expects the chat ID of the team's telegram admin chat for notifications.
     * This is optional for development environments as it will be mocked.
     */
    TELE_ADMIN_CHAT_ID: Joi.string().optional(),

    /**
     * Arbitrary default TTL
     */
    THROTTLE_TTL: Joi.number().default(3000),

    /**
     * Arbitrary default limit within each TTL period
     */
    THROTTLE_LIMIT: Joi.number().default(150),

    /**
     * Use this to run Prisma with verbose mode, defaults to false.
     */
    PRISMA_VERBOSE: Joi.boolean().default(false),
  } satisfies JoiEnvVarValidationSchema),

  // Strict Joi validation options
  // validationOptions: {
  //   // Do not allow unknown keys in the environment variables
  //   allowUnknown: false,

  //   // Continue validation on first error to get all errors
  //   abortEarly: false,
  // },
});
