import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// firebaseConfig auto generated in project settings
const firebaseApp = initializeApp({
  apiKey: "AIzaSyBDrlOR6jzqOkvfElrssnbXLCwl8zsh2w0",
  authDomain: "thepmftool.firebaseapp.com",
  projectId: "thepmftool",
  storageBucket: "thepmftool.appspot.com",
  messagingSenderId: "894898920260",
  appId: "1:894898920260:web:491c2b369d3aeda4aed511",
  measurementId: "G-0SKW8HDG7Z",
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
