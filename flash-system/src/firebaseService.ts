import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, ref, set, get, Database } from "firebase/database";
import { PredictionsMap } from "./types";

// Safe, lazy initialization of Firebase Realtime Database
let dbInstance: Database | null = null;
let isConfigured = false;

// Attempt to detect if Firebase environment is present
const getFirebaseConfig = () => {
  // Check if we have env keys or dynamic configuration
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  const databaseURL = import.meta.env.VITE_FIREBASE_DATABASE_URL;
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;

  if (apiKey && databaseURL) {
    return {
      apiKey,
      databaseURL,
      projectId,
      authDomain: `${projectId}.firebaseapp.com`,
      storageBucket: `${projectId}.appspot.com`,
    };
  }
  return null;
};

export const initFirebaseDatabase = (): Database | null => {
  if (dbInstance) return dbInstance;

  try {
    const config = getFirebaseConfig();
    if (!config) {
      console.warn("Firebase not configured. Falling back to LocalStorage persistence.");
      return null;
    }

    const app = getApps().length === 0 ? initializeApp(config) : getApp();
    dbInstance = getDatabase(app);
    isConfigured = true;
    console.log("Firebase Realtime Database initialized successfully.");
    return dbInstance;
  } catch (err) {
    console.error("Failed to initialize Firebase:", err);
    return null;
  }
};

// Write predictions
export const savePredictionsToDatabase = async (predictions: PredictionsMap): Promise<boolean> => {
  const rtdb = initFirebaseDatabase();
  
  // Save to localStorage regardless for offline robustness
  localStorage.setItem("m11", JSON.stringify(predictions));

  if (rtdb && isConfigured) {
    try {
      const rRef = ref(rtdb, "m11");
      await set(rRef, predictions);
      console.log("Saved predictions to Firebase under 'm11' successfully.");
      return true;
    } catch (err) {
      console.error("Firebase write failed, using localStorage fallback:", err);
      return false;
    }
  }
  return false;
};

// Fetch predictions
export const fetchPredictionsFromDatabase = async (): Promise<PredictionsMap | null> => {
  const rtdb = initFirebaseDatabase();

  if (rtdb && isConfigured) {
    try {
      const rRef = ref(rtdb, "m11");
      const snapshot = await get(rRef);
      if (snapshot.exists()) {
        const val = snapshot.val();
        console.log("Fetched predictions from Firebase Realtime Database.");
        // Sync local storage
        localStorage.setItem("m11", JSON.stringify(val));
        return val;
      }
    } catch (err) {
      console.error("Firebase read failed, trying localStorage fallback:", err);
    }
  }

  // Fallback to localStorage
  const localData = localStorage.getItem("m11");
  if (localData) {
    try {
      return JSON.parse(localData);
    } catch (e) {
      console.error("Failed to parse localStorage predictions:", e);
    }
  }
  return null;
};

export interface TimedAdminCode {
  code: string;
  expiresAt: number | null; // Milliseconds timestamp of expiration, null for lifetime/unlimited
}

// Fetch list of custom admin codes
export const fetchAdminCodes = async (): Promise<TimedAdminCode[]> => {
  const rtdb = initFirebaseDatabase();

  const convertToTimedCodes = (raw: any[]): TimedAdminCode[] => {
    return raw.map((item) => {
      if (typeof item === "string") {
        return { code: item, expiresAt: null };
      }
      if (item && typeof item === "object" && item.code) {
        return {
          code: item.code,
          expiresAt: typeof item.expiresAt === "number" ? item.expiresAt : null
        };
      }
      return { code: String(item), expiresAt: null };
    });
  };

  if (rtdb && isConfigured) {
    try {
      const rRef = ref(rtdb, "m11_codes");
      const snapshot = await get(rRef);
      if (snapshot.exists()) {
        const val = snapshot.val();
        if (Array.isArray(val)) {
          const parsed = convertToTimedCodes(val);
          localStorage.setItem("m11_codes_v2", JSON.stringify(parsed));
          return parsed;
        }
      }
    } catch (err) {
      console.error("Firebase error fetching admin codes:", err);
    }
  }

  const localData = localStorage.getItem("m11_codes_v2") || localStorage.getItem("m11_codes");
  if (localData) {
    try {
      const parsedRaw = JSON.parse(localData);
      if (Array.isArray(parsedRaw)) {
        return convertToTimedCodes(parsedRaw);
      }
    } catch {
      // ignore
    }
  }
  return [{ code: "XR88", expiresAt: null }];
};

// Save new list of admin codes
export const saveAdminCodes = async (codes: TimedAdminCode[]): Promise<boolean> => {
  const rtdb = initFirebaseDatabase();
  localStorage.setItem("m11_codes_v2", JSON.stringify(codes));

  if (rtdb && isConfigured) {
    try {
      const rRef = ref(rtdb, "m11_codes");
      await set(rRef, codes);
      return true;
    } catch (err) {
      console.error("Firebase error saving admin codes:", err);
      return false;
    }
  }
  return true;
};

// Fetch dynamic Telegram channel link
export const fetchTelegramLink = async (): Promise<string> => {
  const rtdb = initFirebaseDatabase();

  if (rtdb && isConfigured) {
    try {
      const rRef = ref(rtdb, "m11_tele_link");
      const snapshot = await get(rRef);
      if (snapshot.exists()) {
        const val = snapshot.val();
        if (typeof val === "string" && val.trim() !== "") {
          localStorage.setItem("m11_tele_link", val);
          return val;
        }
      }
    } catch (err) {
      console.error("Firebase error fetching telegram link:", err);
    }
  }

  const localLink = localStorage.getItem("m11_tele_link");
  return localLink || "https://t.me/P9_B_ET";
};

// Save dynamic Telegram channel link
export const saveTelegramLink = async (link: string): Promise<boolean> => {
  const rtdb = initFirebaseDatabase();
  localStorage.setItem("m11_tele_link", link);

  if (rtdb && isConfigured) {
    try {
      const rRef = ref(rtdb, "m11_tele_link");
      await set(rRef, link);
      return true;
    } catch (err) {
      console.error("Firebase error saving telegram link:", err);
      return false;
    }
  }
  return true;
};


