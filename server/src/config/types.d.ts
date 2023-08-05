import type { Schema } from 'joi';

/**
 * All properties are defined, even though some of these env var might be optional,
 * because ConfigModule is expected to use Joi validation schema to set default
 * values for missing env vars, therefore, anywhere else that gets `ConfigService`
 * injected through DI, can be assured that the value is available and the type of
 * it will never be optional (undefined).
 *
 * See `config.module` for their specific schema and default values.
 */
export interface EnvironmentVariables {
  readonly version: string;
  readonly RECAPTCHA_SECRET: string;
  readonly POSTMARK_API_KEY: string;
  readonly THROTTLE_TTL: number;
  readonly THROTTLE_LIMIT: number;
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
