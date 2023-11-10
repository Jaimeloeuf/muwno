import { useUser } from "./user.store";

/**
 * Use this function to initialize all stores that needs to
 * run their init method on app start if user is logged in.
 *
 * Can be a fire and forget
 */
export async function initStoresOnAppStartIfLoggedIn(): Promise<void> {
  console.log(`Running initStoresOnAppStartIfLoggedIn`);

  // Run all of these initializations without any particular order
  await Promise.all([
    // If user account is no longer valid this will log them out.
    useUser().getUser(),
  ]);
}
