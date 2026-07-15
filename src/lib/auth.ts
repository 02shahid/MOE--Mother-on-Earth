import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "./firebase";

/* ───────────────────────────────────────
   Types & Utilities
   ─────────────────────────────────────── */

export interface MockUser {
  uid: string;
  email: string;
  displayName: string | null;
}

export function triggerAuthChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("moe-auth-state-change"));
  }
}

/** Opens a mock sign-in popup to mimic real OAuth login flow when Firebase is not configured */
const openMockPopup = (provider: "google" | "facebook" | "apple"): Promise<MockUser> => {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      resolve({ uid: "", email: "", displayName: null });
      return;
    }

    const width = 460;
    const height = 580;
    const left = window.screenX + (window.innerWidth - width) / 2;
    const top = window.screenY + (window.innerHeight - height) / 2;

    const popup = window.open(
      `/mock-auth-provider?provider=${provider}`,
      "Mock Authentication Provider",
      `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes`
    );

    if (!popup) {
      reject({ code: "auth/popup-blocked", message: "Popup was blocked by the browser. Please enable popups." });
      return;
    }

    const messageListener = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data && event.data.type === "moe-social-login-success") {
        cleanup();
        resolve(event.data.user);
      }
    };

    const cleanup = () => {
      window.removeEventListener("message", messageListener);
      clearInterval(checkClosed);
    };

    window.addEventListener("message", messageListener);

    const checkClosed = setInterval(() => {
      if (popup.closed) {
        cleanup();
        // Give local storage updates a moment to sync
        setTimeout(() => {
          const sessionStr = localStorage.getItem("moe_current_session");
          if (sessionStr) {
            try {
              resolve(JSON.parse(sessionStr));
            } catch {
              reject({ code: "auth/popup-closed-by-user", message: "Sign-in popup was closed." });
            }
          } else {
            reject({ code: "auth/popup-closed-by-user", message: "Sign-in popup was closed." });
          }
        }, 100);
      }
    }, 500);
  });
};

/* ───────────────────────────────────────
   Email / Password Authentication
   ─────────────────────────────────────── */

/** Create a new user with email and password */
export async function signUpWithEmail(
  email: string,
  password: string,
  displayName?: string
) {
  if (isFirebaseConfigured) {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName && credential.user) {
      await updateProfile(credential.user, { displayName });
    }
    return credential.user;
  }

  // Mock implementation
  if (typeof window === "undefined") return { uid: "", email, displayName: null };

  const accounts = JSON.parse(localStorage.getItem("moe_accounts") || "[]");
  if (accounts.some((acc: any) => acc.email === email)) {
    throw { code: "auth/email-already-in-use" };
  }

  const newUid = "mock-uid-" + Math.random().toString(36).substring(2, 9);
  const newAccount = { uid: newUid, email, password, displayName: displayName || email.split("@")[0] };
  accounts.push(newAccount);
  localStorage.setItem("moe_accounts", JSON.stringify(accounts));

  // Auto-login session
  const sessionUser: MockUser = { uid: newUid, email, displayName: newAccount.displayName };
  localStorage.setItem("moe_current_session", JSON.stringify(sessionUser));
  triggerAuthChange();

  return sessionUser;
}

/** Sign in an existing user with email and password */
export async function signInWithEmail(email: string, password: string) {
  if (isFirebaseConfigured) {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return credential.user;
  }

  // Mock implementation
  if (typeof window === "undefined") return { uid: "", email, displayName: null };

  const accounts = JSON.parse(localStorage.getItem("moe_accounts") || "[]");
  const account = accounts.find((acc: any) => acc.email === email && acc.password === password);
  if (!account) {
    throw { code: "auth/invalid-credential" };
  }

  const sessionUser: MockUser = { uid: account.uid, email: account.email, displayName: account.displayName };
  localStorage.setItem("moe_current_session", JSON.stringify(sessionUser));
  triggerAuthChange();

  return sessionUser;
}

/* ───────────────────────────────────────
   Social Sign-In (Google, Facebook, Apple)
   ─────────────────────────────────────── */

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

/** Sign in with Google popup */
export async function signInWithGoogle() {
  if (isFirebaseConfigured) {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  }

  // Mock Implementation with Popup Window
  const user = await openMockPopup("google");
  triggerAuthChange();
  return user;
}

/** Sign in with Facebook popup */
export async function signInWithFacebook() {
  if (isFirebaseConfigured) {
    const result = await signInWithPopup(auth, facebookProvider);
    return result.user;
  }

  // Mock Implementation with Popup Window
  const user = await openMockPopup("facebook");
  triggerAuthChange();
  return user;
}

/** Sign in with Apple popup */
export async function signInWithApple() {
  if (isFirebaseConfigured) {
    const appleProvider = new OAuthProvider("apple.com");
    const result = await signInWithPopup(auth, appleProvider);
    return result.user;
  }

  // Mock Implementation with Popup Window
  const user = await openMockPopup("apple");
  triggerAuthChange();
  return user;
}

/* ───────────────────────────────────────
   Password Reset
   ─────────────────────────────────────── */

/** Send a password reset email */
export async function resetPassword(email: string) {
  if (isFirebaseConfigured) {
    await sendPasswordResetEmail(auth, email);
    return;
  }

  // Mock Implementation
  if (typeof window === "undefined") return;
  const accounts = JSON.parse(localStorage.getItem("moe_accounts") || "[]");
  const accountExists = accounts.some((acc: any) => acc.email === email);
  if (!accountExists) {
    throw { code: "auth/user-not-found" };
  }
}

/* ───────────────────────────────────────
   Sign Out
   ─────────────────────────────────────── */

/** Sign the current user out */
export async function signOut() {
  if (isFirebaseConfigured) {
    await firebaseSignOut(auth);
    return;
  }

  // Mock Implementation
  if (typeof window !== "undefined") {
    localStorage.removeItem("moe_current_session");
    triggerAuthChange();
  }
}

/* ───────────────────────────────────────
   Error Handling Utility
   ─────────────────────────────────────── */

/** Convert Firebase auth error codes to user-friendly messages */
export function getAuthErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case "auth/email-already-in-use":
      return "This email is already registered. Try signing in instead.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/operation-not-allowed":
      return "This sign-in method is not enabled. Please contact support.";
    case "auth/weak-password":
      return "Password is too weak. Use at least 6 characters.";
    case "auth/user-disabled":
      return "This account has been disabled. Please contact support.";
    case "auth/user-not-found":
      return "No account found with this email. Please register first.";
    case "auth/wrong-password":
      return "Incorrect password. Please try again.";
    case "auth/invalid-credential":
      return "Invalid email or password. Please try again.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a moment and try again.";
    case "auth/popup-closed-by-user":
      return "Sign-in popup was closed.";
    case "auth/popup-blocked":
      return "Popup was blocked by your browser. Please enable popups to continue.";
    case "auth/network-request-failed":
      return "Network error. Please check your connection.";
    default:
      return "An unexpected error occurred. Please try again.";
  }
}

/** Type guard for Firebase errors */
export function isFirebaseError(
  error: unknown
): error is { code: string; message: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    ("code" in error || "message" in error)
  );
}
