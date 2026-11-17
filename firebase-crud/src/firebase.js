import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyAw1IRcEyA06HPtL6N17QjcG6486pPcRL4",
  authDomain: "week6-223593.firebaseapp.com",
  projectId: "week6-223593",
  storageBucket: "week6-223593.appspot.com",
  messagingSenderId: "000000000000",
  // Replace this with the actual appId from your Firebase project settings.
  appId: "1:000000000000:web:0000000000000000"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);