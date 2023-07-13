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
   * From NestJS docs: Accessing process.env can be slow, caching it can increase
   * the performance of the `ConfigService.get` method when it comes to variables
   * stored in process.env
   */
  cache: true,

  /**
   * Use Joi to ensure that all environment variables are required and defined
   */
  validationSchema: Joi.object({
    /**
     * Expect `version` to be a string made with build time git branch and commit hash
     */
    version: Joi.string().required(),

    /**
     * Arbitrary default TTL
     */
    THROTTLE_TTL: Joi.number().default(10),

    /**
     * Arbitrary default limit within each TTL period
     */
    THROTTLE_LIMIT: Joi.number().default(10),

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