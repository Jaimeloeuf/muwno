import type { Schema } from 'joi';

/**
 * All properties are defined, even though some of these might be optional,
 * because ConfigModule is expected to use Joi validation schema to set default
 * values for missing env vars, therefore, anywhere else that uses
 * `ConfigService` can be assured that the value is available and the type of
 * it will never be optional.
 *
 * See `config.module` for their specific schema and default values.
 */
export interface EnvironmentVariables {
  /**
   * NODE_ENV String used by Node build tools.
   */
  readonly NODE_ENV: 'development' | 'production' | 'test';

  /**
   * A string made with build time git branch and commit hash.
   */
  readonly version: string;

  /**
   * Recaptcha secret key.
   */
  readonly RECAPTCHA_SECRET: string;

  /**
   * POSTMARK Email Service API key.
   */
  readonly POSTMARK_API_KEY: string;

  /**
   * API key to access OpenAI's API.
   */
  readonly OPENAI_API_KEY: string;

  /**
   * OpenAI Org ID to know which Org does usage of OpenAI API count towards with
   * the `OPENAI_API_KEY`.
   */
  readonly OPENAI_ORG: string;

  /**
   * Stripe's Secret Key
   */
  readonly STRIPE_SECRET_KEY: string;

  /**
   * Stripe's Webhook Secret
   */
  readonly STRIPE_WEBHOOK_SECRET: string;

  /**
   * Stripe's Webhook Path Secret used as a simple way to ensure that the caller
   * is actually Stripe by knowing the secret path.
   */
  readonly STRIPE_WEBHOOK_PATH: string;

  /**
   * Telegram bot's token.
   */
  readonly TELE_BOT_TOKEN: string;

  /**
   * Chat ID of thepmftool's telegram admin chat.
   */
  readonly TELE_ADMIN_CHAT_ID: string;

  /**
   * Default Time To Live (TTL) value in seconds for throttler / rate-limiter.
   */
  readonly THROTTLE_TTL: number;

  /**
   * Default max limit of requests within each `THROTTLE_TTL` period.
   */
  readonly THROTTLE_LIMIT: number;

  /**
   * Flag to enable Prisma's verbose mode.
   */
  readonly PRISMA_VERBOSE: boolean;
}

/**
 * Type alias of all the keys on the `EnvironmentVariables` interface, used to
 * create the `JoiEnvVarValidationSchema` type alias.
 */
export type EnvironmentVariablesKeys = keyof EnvironmentVariables;

/**
 * Type alias for a record of `EnvironmentVariables` keys to Joi validation
 * schema objects, used for type checking to ensure that all `EnvironmentVariables`
 * properties have a corresponding Joi validation schema object created for it.
 */
export type JoiEnvVarValidationSchema = Record<
  EnvironmentVariablesKeys,
  Schema
>;
