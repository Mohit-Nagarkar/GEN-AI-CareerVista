// Import Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // ✅ add GoogleAuthProvider
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAa30LEKV5kAOknSfi1fsohqtr1p9mGj8E",
  authDomain: "careervista-c1174.firebaseapp.com",
  projectId: "careervista-c1174",
  storageBucket: "careervista-c1174.appspot.com",
  messagingSenderId: "862608126488",
  appId: "1:862608126488:web:e828b779a689de12de096d",
  measurementId: "G-QBVV0J1GT2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// ✅ Google Sign-In provider
export const googleProvider = new GoogleAuthProvider();

export default app;
