import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // 1. Yeh line add karein

// Aapka Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyA2GsapelFGjADEvTXWZF16j0nXl7YpGfw",
  authDomain: "maintainiq-ai.firebaseapp.com",
  projectId: "maintainiq-ai",
  storageBucket: "maintainiq-ai.firebasestorage.app",
  messagingSenderId: "2722194127",
  appId: "1:2722194127:web:935e21dd4823b32a61cdba",
  measurementId: "G-B1KPJVNBFG"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app); // 2. Yeh line bhi add karein