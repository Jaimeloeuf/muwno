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
   * Explicitly specify the file path of the .env files.
   * The values from the first file takes precedence.
   */
  envFilePath: ['.env.development', '.env.production', '.env'],

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
    version: Joi.string().required(),

    /**
     * Expects the Recaptcha secret key.
     */
    RECAPTCHA_SECRET: Joi.string().required(),

    /**
     * Expects the POSTMARK Email Service API key.
     */
    POSTMARK_API_KEY: Joi.string().required(),

    /**
     * Expects the API key to access OpenAI's API.
     */
    OPENAI_API_KEY: Joi.string().required(),

    /**
     * Expects the Org ID of thepmftool's OpenAI API org.
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
     */
    TELE_BOT_TOKEN: Joi.string().required(),

    /**
     * Expects the chat ID of thepmftool's telegram admin chat.
     */
    TELE_ADMIN_CHAT_ID: Joi.string().required(),

    /**
     * Arbitrary default TTL
     */
    THROTTLE_TTL: Joi.number().default(3),

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
