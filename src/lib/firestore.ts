import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  type Timestamp,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";

/* ───────────────────────────────────────
   Types
   ─────────────────────────────────────── */

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  interests: string[];
  role: "user";
  createdAt: any;
}

export interface NGOProfile {
  uid: string;
  name: string;
  regNumber: string;
  email: string;
  mission: string;
  category: string;
  role: "ngo";
  createdAt: any;
}

/* ───────────────────────────────────────
   User Profiles
   ─────────────────────────────────────── */

/** Create or update a user profile in Firestore */
export async function createUserProfile(
  uid: string,
  data: {
    name: string;
    email: string;
    phone?: string;
    interests: string[];
  }
) {
  const profile: UserProfile = {
    uid,
    name: data.name,
    email: data.email,
    phone: data.phone || "",
    interests: data.interests,
    role: "user",
    createdAt: isFirebaseConfigured ? serverTimestamp() : new Date().toISOString(),
  };

  if (isFirebaseConfigured) {
    await setDoc(doc(db, "users", uid), profile);
    return profile;
  }

  // Mock Implementation
  if (typeof window !== "undefined") {
    const profiles = JSON.parse(localStorage.getItem("moe_user_profiles") || "{}");
    profiles[uid] = profile;
    localStorage.setItem("moe_user_profiles", JSON.stringify(profiles));
  }

  return profile;
}

/** Get a user profile from Firestore */
export async function getUserProfile(
  uid: string
): Promise<UserProfile | null> {
  if (isFirebaseConfigured) {
    const snap = await getDoc(doc(db, "users", uid));
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  }

  // Mock Implementation
  if (typeof window === "undefined") return null;
  const profiles = JSON.parse(localStorage.getItem("moe_user_profiles") || "{}");
  return profiles[uid] || null;
}

/* ───────────────────────────────────────
   NGO Profiles
   ─────────────────────────────────────── */

/** Create or update an NGO profile in Firestore */
export async function createNGOProfile(
  uid: string,
  data: {
    name: string;
    regNumber: string;
    email: string;
    mission: string;
    category: string;
  }
) {
  const profile: NGOProfile = {
    uid,
    name: data.name,
    regNumber: data.regNumber,
    email: data.email,
    mission: data.mission,
    category: data.category,
    role: "ngo",
    createdAt: isFirebaseConfigured ? serverTimestamp() : new Date().toISOString(),
  };

  if (isFirebaseConfigured) {
    await setDoc(doc(db, "ngos", uid), profile);
    return profile;
  }

  // Mock Implementation
  if (typeof window !== "undefined") {
    const profiles = JSON.parse(localStorage.getItem("moe_ngo_profiles") || "{}");
    profiles[uid] = profile;
    localStorage.setItem("moe_ngo_profiles", JSON.stringify(profiles));
  }

  return profile;
}

/** Get an NGO profile from Firestore */
export async function getNGOProfile(
  uid: string
): Promise<NGOProfile | null> {
  if (isFirebaseConfigured) {
    const snap = await getDoc(doc(db, "ngos", uid));
    if (snap.exists()) {
      return snap.data() as NGOProfile;
    }
    return null;
  }

  // Mock Implementation
  if (typeof window === "undefined") return null;
  const profiles = JSON.parse(localStorage.getItem("moe_ngo_profiles") || "{}");
  return profiles[uid] || null;
}

/* ───────────────────────────────────────
   Combined Profile Lookup
   ─────────────────────────────────────── */

/** Check if the user is a user or NGO and return the profile */
export async function getAnyProfile(
  uid: string
): Promise<(UserProfile | NGOProfile) | null> {
  // Try user first
  const userProfile = await getUserProfile(uid);
  if (userProfile) return userProfile;

  // Then try NGO
  const ngoProfile = await getNGOProfile(uid);
  if (ngoProfile) return ngoProfile;

  return null;
}
