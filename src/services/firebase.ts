import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const missingFirebaseEnvVars = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

export const firebaseConfigError =
  missingFirebaseEnvVars.length > 0
    ? `Firebase authentication is not configured. Missing: ${missingFirebaseEnvVars.join(", ")}.`
    : null;

if (firebaseConfigError) {
  console.warn(firebaseConfigError);
}

const app = firebaseConfigError
  ? null
  : getApps().length > 0
  ? getApp()
  : initializeApp(firebaseConfig);

export const auth = app ? getAuth(app) : null;
export const isFirebaseConfigured = auth !== null;
export const googleProvider = isFirebaseConfigured ? new GoogleAuthProvider() : null;

googleProvider?.setCustomParameters({
  prompt: "select_account",
});
