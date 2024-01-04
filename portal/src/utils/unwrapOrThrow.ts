/**
 * Unwraps a `Result<Value, Error>`
 *
 * Takes a `Result<Value, Error>` type and returns `Value` if there is no
 * `Error`. Throws the result once it is confirmed to be an `Error` with an
 * instanceof check.
 *
 * ### Why does this exists?
 * In Vue Setup Scripts, where only the happy path is accounted for, aka where
 * there is no error, and the template always assume its ability to render data,
 * then when there is an error, there is no way to stop the setup script from
 * running halfway.
 * Therefore, now that all API call functions returns a union type of the actual
 * value and Error, this wrapper allows the error to be thrown in setup scripts
 * so it actually stops running and show the GlobalError view. All while
 * requiring minimal changes to the original code flow, just an extra wrapper
 * function so that the unwrapping and throwing boilerplate code does not need
 * to be written by the setup scripts.
 * Errors in setup scripts' top level should throw when something goes wrong
 * because it is not an error that can be "ignored" and continue, users cant fix
 * it by just trying again or ignoring it.
 */
export function unwrapOrThrow<T, E extends Error>(
  result: T | E
): Exclude<T, E> {
  if (result instanceof Error) {
    throw result;
  }

  // TS cant narrow the type after the instanceof check, so casting instead.
  return result as Exclude<T, E>;
}
