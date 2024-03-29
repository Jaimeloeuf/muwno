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
   * This is optional for development environments as it will be mocked.
   */
  readonly POSTMARK_API_KEY: string | undefined;

  /**
   * Email Address used for transactional emails.
   */
  readonly EMAIL_TRANSACTIONAL_ADDRESS: string;

  /**
   * Email Address used for user replies to transactional emails.
   */
  readonly EMAIL_TRANSACTIONAL_REPLY: string;

  /**
   * Email Address used for survey email blasts.
   */
  readonly EMAIL_BLAST_ADDRESS: string;

  /**
   * Email Address used for user replies to email blast emails.
   */
  readonly EMAIL_BLAST_REPLY: string;

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
   * This is optional for development environments as it will be mocked.
   */
  readonly TELE_BOT_TOKEN: string | undefined;

  /**
   * Chat ID of the team's telegram admin chat for notifications.
   * This is optional for development environments as it will be mocked.
   */
  readonly TELE_ADMIN_CHAT_ID: string | undefined;

  /**
   * API Key for OpenMeter.
   * This is optional for development environments as it will be mocked.
   */
  readonly OPENMETER_API_KEY: string | undefined;

  /**
   * Default Time To Live (TTL) value in milliseconds for throttler.
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

  /**
   * Form's root link.
   */
  readonly FORM_LINK: string;
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
