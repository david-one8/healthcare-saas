import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  getAdditionalUserInfo,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type Unsubscribe,
  type User,
  updateProfile,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { create } from "zustand";
import { auth, firebaseConfigError, googleProvider } from "../services/firebase";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  configError: string | null;
  initialize: () => void;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  signInWithGoogle: () => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  requestPasswordReset: (email: string) => Promise<boolean>;
  clearError: () => void;
}

function mapFirebaseError(code: string) {
  switch (code) {
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/missing-password":
      return "Password is required.";
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Invalid email or password.";
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    case "auth/operation-not-allowed":
      return "This sign-in method is not enabled in Firebase Authentication.";
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";
    case "auth/popup-closed-by-user":
      return "Google sign-in was cancelled before completion.";
    case "auth/popup-blocked":
      return "The Google sign-in popup was blocked by your browser.";
    case "auth/cancelled-popup-request":
      return "Another sign-in request is already in progress.";
    case "auth/account-exists-with-different-credential":
      return "An account already exists with a different sign-in method for this email.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";
    default:
      return "Authentication failed. Please try again.";
  }
}

let authSubscription: Unsubscribe | null = null;

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  error: null,
  initialized: false,
  configError: firebaseConfigError,

  initialize: () => {
    if (get().initialized) return;

    if (!auth) {
      set({
        initialized: true,
        loading: false,
        user: null,
        error: firebaseConfigError,
        configError: firebaseConfigError,
      });
      return;
    }

    set({ initialized: true, loading: true, error: null });

    authSubscription?.();
    authSubscription = onAuthStateChanged(
      auth,
      (user) => set({ user, loading: false, error: null }),
      () => set({ user: null, loading: false, error: "Unable to restore session." })
    );
  },

  signup: async (name, email, password) => {
    if (!auth) {
      set({ loading: false, error: firebaseConfigError, configError: firebaseConfigError });
      return false;
    }

    set({ loading: true, error: null });

    try {
      await setPersistence(auth, browserLocalPersistence);
      const credentials = await createUserWithEmailAndPassword(auth, email, password);
      const trimmedName = name.trim();

      if (trimmedName) {
        await updateProfile(credentials.user, { displayName: trimmedName });
      }

      await sendEmailVerification(credentials.user);
      set({ user: credentials.user, loading: false, error: null });
      return true;
    } catch (error) {
      const message =
        error instanceof FirebaseError
          ? mapFirebaseError(error.code)
          : "Unable to create your account.";
      set({ loading: false, error: message });
      return false;
    }
  },

  signInWithGoogle: async () => {
    if (!auth || !googleProvider) {
      set({ loading: false, error: firebaseConfigError, configError: firebaseConfigError });
      return false;
    }

    set({ loading: true, error: null });

    try {
      await setPersistence(auth, browserLocalPersistence);
      const credentials = await signInWithPopup(auth, googleProvider);
      const additionalUserInfo = getAdditionalUserInfo(credentials);

      if (additionalUserInfo?.isNewUser && !credentials.user.emailVerified) {
        await sendEmailVerification(credentials.user);
      }

      set({ user: credentials.user, loading: false, error: null });
      return true;
    } catch (error) {
      const message =
        error instanceof FirebaseError
          ? mapFirebaseError(error.code)
          : "Unable to sign in with Google.";
      set({ loading: false, error: message });
      return false;
    }
  },

  login: async (email, password) => {
    if (!auth) {
      set({ loading: false, error: firebaseConfigError, configError: firebaseConfigError });
      return false;
    }

    set({ loading: true, error: null });

    try {
      await setPersistence(auth, browserLocalPersistence);
      await signInWithEmailAndPassword(auth, email, password);
      set({ loading: false });
      return true;
    } catch (error) {
      const message =
        error instanceof FirebaseError
          ? mapFirebaseError(error.code)
          : "Unable to log in.";
      set({ loading: false, error: message });
      return false;
    }
  },

  logout: async () => {
    if (!auth) {
      set({ loading: false, user: null, error: firebaseConfigError, configError: firebaseConfigError });
      return false;
    }

    set({ loading: true, error: null });

    try {
      await signOut(auth);
      set({ user: null, error: null, loading: false });
      return true;
    } catch (error) {
      const message =
        error instanceof FirebaseError
          ? mapFirebaseError(error.code)
          : "Unable to log out.";
      set({ loading: false, error: message });
      return false;
    }
  },

  requestPasswordReset: async (email) => {
    if (!auth) {
      set({ loading: false, error: firebaseConfigError, configError: firebaseConfigError });
      return false;
    }

    set({ loading: true, error: null });

    try {
      await sendPasswordResetEmail(auth, email);
      set({ loading: false, error: null });
      return true;
    } catch (error) {
      if (error instanceof FirebaseError && error.code === "auth/user-not-found") {
        set({ loading: false, error: null });
        return true;
      }

      const message =
        error instanceof FirebaseError
          ? mapFirebaseError(error.code)
          : "Unable to send a reset email.";
      set({ loading: false, error: message });
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));
