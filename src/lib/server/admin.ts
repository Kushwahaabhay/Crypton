import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { env } from '$env/dynamic/private';
import admin from 'firebase-admin';

export function getAdminDB() {
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: env.FB_PROJECT_ID?.trim(),
                clientEmail: env.FB_CLIENT_EMAIL?.trim(),
                privateKey: env.FB_PRIVATE_KEY?.trim().replace(/\\n/g, '\n'),
            }),
        });
    }
    return getFirestore();
}

export function getAdminAuth() {
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: env.FB_PROJECT_ID?.trim(),
                clientEmail: env.FB_CLIENT_EMAIL?.trim(),
                privateKey: env.FB_PRIVATE_KEY?.trim().replace(/\\n/g, '\n'),
            }),
        });
    }
    return getAuth();
}
