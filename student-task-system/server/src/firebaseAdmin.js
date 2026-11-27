import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { config } from "./config.js";

function createApp() {
  if (!config.projectId) {
    throw new Error("FIREBASE_PROJECT_ID is not set. Copy .env.example to .env and fill it in.");
  }

  // Local emulators accept any project ID and need no private key.
  if (config.usingEmulators) {
    return initializeApp({ projectId: config.projectId });
  }

  if (!config.clientEmail || !config.privateKey) {
    throw new Error("FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY must be set (from your service account key).");
  }

  return initializeApp({
    credential: cert({
      projectId: config.projectId,
      clientEmail: config.clientEmail,
      privateKey: config.privateKey
    })
  });
}

const app = createApp();
export const adminAuth = getAuth(app);
export const db = getFirestore(app);
