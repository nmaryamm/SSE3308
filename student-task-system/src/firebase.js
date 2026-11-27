import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// These values are public identifiers, not secrets. Security comes from
// Firebase Authentication + the Express backend + Firestore security rules.
const firebaseConfig = {
 apiKey: "AIzaSyDWm_mwNWMNV2Ab50xlzTJB9sNYzhTLS0c",
 authDomain: "lab7-223593.firebaseapp.com",
 projectId: "lab7-223593",
 storageBucket: "lab7-223593.firebasestorage.app",
 messagingSenderId: "449203187414",
 appId: "1:449203187414:web:56c3f6a58835a930336377"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// Firestore and Cloud Functions are no longer used by the browser:
// all task operations go through the Express API (see src/api.js).
