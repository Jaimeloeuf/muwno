import { createNewRouter } from "./CreateNewRouter";

import { LoginRoute, HomeRoute } from "./index";
// import { auth } from "../firebase";

/**
 * Force return to be boolean
 *
 * @todo Return true for all routes now
 */
// const firebaseAuthPredicate = () => !!auth.currentUser;
// const firebaseAuthPredicate = () => auth.currentUser !== null;
// const firebaseAuthPredicate = () => auth.currentUser as unknown as boolean;
const firebaseAuthPredicate = () => true;

/**
 * Router created for this project
 */
export const router = createNewRouter(
  LoginRoute.name,
  HomeRoute.name,
  firebaseAuthPredicate
);
