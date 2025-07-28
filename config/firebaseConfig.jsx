import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, getAuth, } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAKGU8P-suHY3LQbIF0nBTrDAEPRoCCEa4",
  authDomain: "banglashorts-5f0bc.firebaseapp.com",
  projectId: "banglashorts-5f0bc",
  storageBucket: "banglashorts-5f0bc.firebasestorage.app",
  messagingSenderId: "607796186357",
  appId: "1:607796186357:web:b3c361edc54594123bc9bc",
  measurementId: "G-BBXHBS1NM3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Initialize Auth with persistence
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (error) {
  console.error("Firebase Auth initialization error:", error);
  auth = getAuth(app); // Fallback to default auth if persistence fails
}

export { auth };
export default app;
