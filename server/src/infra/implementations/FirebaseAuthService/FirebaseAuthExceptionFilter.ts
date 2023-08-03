import { Catch, ArgumentsHost, BadRequestException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

import { FirebaseAuthException } from './FirebaseAuthException.js';

/**
 * Catches the generic FirebaseAuthException, and maps it to a
 * specific HTTP Exception for certain firebase auth exception
 * codes, else return the generic HTTP Exception.
 *
 * Firebase Auth does not support type safe error checking with
 * custom Error classes for each specific error as of writing.
 * Therefore need to check the code value directly
 * https://stackoverflow.com/questions/72322523/importing-autherror-in-typescript-using-firebase
 * https://github.com/firebase/firebase-admin-node/issues/403
 */
@Catch(FirebaseAuthException)
export class FirebaseAuthExceptionFilter extends BaseExceptionFilter {
  override catch(exception: FirebaseAuthException, host: ArgumentsHost): void {
    if (exception.code === 'auth/user-not-found')
      return super.catch(
        new BadRequestException(`User not found in system`),
        host,
      );

    super.catch(exception, host);
  }
}
