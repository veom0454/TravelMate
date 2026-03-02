import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration - Replace with your own Firebase config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "YOUR_AUTH_DOMAIN",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "YOUR_STORAGE_BUCKET",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_MESSAGING_SENDER_ID",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "YOUR_APP_ID"
};

// Validate Firebase configuration
const isConfigured = firebaseConfig.apiKey !== "YOUR_API_KEY" && 
                    firebaseConfig.projectId !== "YOUR_PROJECT_ID";

if (!isConfigured && import.meta.env.DEV) {
  console.warn(
    "⚠️ Firebase not configured!\n" +
    "Please create a .env file with your Firebase credentials.\n" +
    "See QUICK_START.md for setup instructions."
  );
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Configure Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
// Add scopes if needed
googleProvider.addScope('profile');
googleProvider.addScope('email');
// Set custom parameters
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app;
