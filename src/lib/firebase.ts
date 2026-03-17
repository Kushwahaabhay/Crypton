import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import {
    PUBLIC_FB_API_KEY,
    PUBLIC_FB_AUTH_DOMAIN,
    PUBLIC_FB_PROJECT_ID,
    PUBLIC_FB_STORAGE_BUCKET,
    PUBLIC_FB_MESSAGING_SENDER_ID,
    PUBLIC_FB_APP_ID
} from '$env/static/public';

const firebaseConfig = {
    apiKey: PUBLIC_FB_API_KEY,
    authDomain: PUBLIC_FB_AUTH_DOMAIN,
    projectId: PUBLIC_FB_PROJECT_ID,
    storageBucket: PUBLIC_FB_STORAGE_BUCKET,
    messagingSenderId: PUBLIC_FB_MESSAGING_SENDER_ID,
    appId: PUBLIC_FB_APP_ID,
};

// Prevent re-initialization during HMR
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export { app };
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);