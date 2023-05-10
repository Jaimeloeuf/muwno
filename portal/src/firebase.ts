// import { initializeApp } from "firebase/app";
// import { getAuth, onAuthStateChanged } from "firebase/auth";

// // firebaseConfig auto generated in project settings
// const firebaseApp = initializeApp({
//   //
// });

// const auth = getAuth(firebaseApp);

// /**
//  * Get authentication header if user is authenticated.
//  * Will not throw if user is unauthenticated,
//  * it just returns `{ Authorization: 'Bearer undefined' }`
//  */
// const getAuthHeader = async () => ({
//   Authorization: `Bearer ${await auth.currentUser?.getIdToken()}`,
// });

// // Make firebase auth use browser's default language
// auth.useDeviceLanguage();

// // Export only the items that will be used
// export { auth, onAuthStateChanged, getAuthHeader };

// @todo Tmp before setting up auth
import { onAuthStateChanged } from "firebase/auth";
export { onAuthStateChanged };
