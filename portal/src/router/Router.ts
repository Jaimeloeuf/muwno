import { createNewRouter } from "./CreateNewRouter";
import { LoginRoute, AllProductRoute } from "./index";
import { auth } from "../firebase";

/**
 * Auth predicate to determine if user is logged in by checking if current user
 * is null or not.
 */
const firebaseAuthPredicate = () => auth.currentUser !== null;

/**
 * Router created for this project
 */
export const router = createNewRouter(
  LoginRoute.name,
  AllProductRoute.name,
  firebaseAuthPredicate
);
