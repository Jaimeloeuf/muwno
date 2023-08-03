/**
 * Custom Firebase Auth exception class for FirebaseAuthService methods
 * to throw instead of letting errors from Firebase Auth SDK bubble
 * through since those errors are generic Error classes and will match
 * any generic Error exception filter, which is not ideal since it will
 * match non Firebase Auth SDK errors too.
 */
export class FirebaseAuthException extends Error {
  code: string;

  constructor(exception: Error) {
    super(exception.message, { cause: exception.cause });

    this.code = (exception as any).code;
    super.stack = exception.stack ?? '';
  }
}
