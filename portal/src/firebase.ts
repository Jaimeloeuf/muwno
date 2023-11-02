import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Get auto generated firebaseConfig in project settings and put in .env file
const firebaseApp = initializeApp({
  apiKey: import.meta.env.VITE_FB_APIKEY,
  authDomain: import.meta.env.VITE_FB_AUTHDOMAIN,
  projectId: import.meta.env.VITE_FB_PROJECTID,
  appId: import.meta.env.VITE_FB_APPID,
});

export const auth = getAuth(firebaseApp);

export { onAuthStateChanged } from "firebase/auth";

export const analytics = getAnalytics(firebaseApp);

/**
 * Get authentication header if user is authenticated.
 * Will not throw if user is unauthenticated,
 * it just returns `{ Authorization: 'Bearer undefined' }`
 */
export const getAuthHeader = async () => ({
  Authorization: `Bearer ${await auth.currentUser?.getIdToken()}`,
});

// Make firebase auth use browser's default language
auth.useDeviceLanguage();
