import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDMCGbBIg_ka2PnoqGIeM-zZeCkQPLDCgg",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "learnflowai-drfgy.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "learnflowai-drfgy",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "learnflowai-drfgy.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "806563221851",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:806563221851:web:a9046217953d9bf8d98a7e",
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
