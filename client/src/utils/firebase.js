import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  onSnapshot 
} from "firebase/firestore";
import defaultMenuData from "../data/defaultMenu.json";

const firebaseConfig = {
  apiKey: "AIzaSyDMnJY0s0-FhPo_8JSOQY4yKk6dACbqw24",
  authDomain: "menucard-ec220.firebaseapp.com",
  projectId: "menucard-ec220",
  storageBucket: "menucard-ec220.firebasestorage.app",
  messagingSenderId: "511637138648",
  appId: "1:511637138648:web:9e08f9c4e71dc8c9a9fbad",
  measurementId: "G-TYWTN7544G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

const COLLECTION_NAME = "restaurant";
const DOC_ID = "dining_delight_menu";

export const menuDocRef = doc(db, COLLECTION_NAME, DOC_ID);

/**
 * Fetch menu data from Firebase Firestore.
 * If not present yet, seeds it with defaultMenuData automatically.
 */
export async function getFirebaseMenu() {
  try {
    const snap = await getDoc(menuDocRef);
    if (snap.exists()) {
      const data = snap.data();
      if (data && Array.isArray(data.items) && data.items.length > 0) {
        return data;
      }
    }
    // Auto-seed initial data to Firestore
    await setDoc(menuDocRef, defaultMenuData);
    return defaultMenuData;
  } catch (err) {
    console.warn("Firestore fetch error, falling back to local data:", err);
    return defaultMenuData;
  }
}

/**
 * Save updated menu data to Firebase Firestore (syncs to ALL devices)
 */
export async function saveFirebaseMenu(updatedData) {
  try {
    const cleanData = JSON.parse(JSON.stringify(updatedData));
    cleanData.updatedAt = new Date().toISOString();
    await setDoc(menuDocRef, cleanData);
    return cleanData;
  } catch (err) {
    console.error("Firestore save error:", err);
    throw err;
  }
}

/**
 * Real-time listener for customer menu
 */
export function subscribeToMenu(onUpdate) {
  try {
    return onSnapshot(menuDocRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data && Array.isArray(data.items) && data.items.length > 0) {
          onUpdate(data);
        }
      }
    }, (error) => {
      console.warn("Firestore snapshot error:", error);
    });
  } catch (e) {
    console.warn("Could not subscribe to Firestore:", e);
    return () => {};
  }
}
