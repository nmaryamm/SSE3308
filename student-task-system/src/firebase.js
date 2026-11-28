import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
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
export const db = getFirestore(app);
export const functions = getFunctions(
 app,
 "asia-southeast1"
);
