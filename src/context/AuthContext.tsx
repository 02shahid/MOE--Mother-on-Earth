"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/lib/firebase";

/* ───────────────────────────────────────
   Types
   ─────────────────────────────────────── */
interface AuthContextType {
  user: {
    uid: string;
    email: string | null;
    displayName: string | null;
  } | null;
  loading: boolean;
}

/* ───────────────────────────────────────
   Context
   ─────────────────────────────────────── */
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

/* ───────────────────────────────────────
   Provider
   ─────────────────────────────────────── */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthContextType["user"]>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeFirebase: (() => void) | undefined;

    const syncLocalSession = () => {
      if (isFirebaseConfigured) return;

      if (typeof window !== "undefined") {
        const sessionStr = localStorage.getItem("moe_current_session");
        if (sessionStr) {
          try {
            const parsed = JSON.parse(sessionStr);
            setUser({
              uid: parsed.uid,
              email: parsed.email || null,
              displayName: parsed.displayName || null,
            });
          } catch {
            setUser(null);
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    };

    if (isFirebaseConfigured) {
      try {
        unsubscribeFirebase = onAuthStateChanged(auth, (firebaseUser) => {
          if (firebaseUser) {
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
            });
          } else {
            setUser(null);
          }
          setLoading(false);
        });
      } catch (error) {
        console.warn("Failed to subscribe to real Firebase auth state:", error);
        syncLocalSession();
      }
    } else {
      syncLocalSession();
      if (typeof window !== "undefined") {
        window.addEventListener("moe-auth-state-change", syncLocalSession);
      }
    }

    return () => {
      if (unsubscribeFirebase) unsubscribeFirebase();
      if (typeof window !== "undefined") {
        window.removeEventListener("moe-auth-state-change", syncLocalSession);
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

/* ───────────────────────────────────────
   Hook
   ─────────────────────────────────────── */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
