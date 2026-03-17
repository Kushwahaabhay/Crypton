import {sequence} from "@sveltejs/kit/hooks";
import * as Sentry from "@sentry/sveltekit";
import { adminAuth, adminDB } from "$lib/server/admin";
import type { Handle } from "@sveltejs/kit";
import {PUBLIC_SENTRY_DSN} from '$env/static/public';
import { SITE_PASSWORD } from '$env/static/private';

Sentry.init({
    dsn: PUBLIC_SENTRY_DSN,
    tracesSampleRate: 1
})

// Cache: uid -> true (user has a profile)
let existingUsers = new Set<string>();
// Cache: uid -> true (user is banned)
let bannedUsers = new Set<string>();
let indexLoaded = false;
const userIndexRef = adminDB.collection("index").doc('userIndex');
const bannedUsersQuery = adminDB.collection("users").where("banned", "==", true);

export const handle = sequence(Sentry.sentryHandle(), (async ({ event, resolve }) => {
    const sessionCookie = event.cookies.get("__session");

    // Allow the verify API through without password check
    if (!event.url.pathname.startsWith('/api/verify')) {
        const verified = event.cookies.get('__verified');
        if (verified !== '1') {
            event.locals.userID = null;
            event.locals.userExists = false;
            event.locals.banned = false;
            event.locals.verified = false;
            return resolve(event);
        }
    }
    event.locals.verified = true;
    if (!indexLoaded) {
        const doc = await userIndexRef.get();
        const qSnap = await bannedUsersQuery.get();
        qSnap.docs.forEach((e) => bannedUsers.add(e.id));
        if (doc.exists) {
            const data = doc.data();
            if (data !== undefined) {
                Object.keys(data).forEach(uid => existingUsers.add(uid));
            }
        }
        userIndexRef.onSnapshot((snap) => {
            const snapData = snap.data() || {};
            existingUsers = new Set(Object.keys(snapData));
        });
        bannedUsersQuery.onSnapshot((snap) => {
            bannedUsers.clear();
            snap.docs.forEach((e) => bannedUsers.add(e.id));
        });
        indexLoaded = true;
    }

    try {
        if (sessionCookie === undefined) {
            event.locals.userID = null;
            event.locals.userExists = false;
            event.locals.banned = false;
            return resolve(event);
        }
        const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie!);
        event.locals.userID = decodedClaims.uid;
        if (existingUsers.has(event.locals.userID)) {
            event.locals.userExists = true;
            event.locals.banned = bannedUsers.has(event.locals.userID);
            return resolve(event);
        } else {
            const docRef = adminDB.collection('users').doc(event.locals.userID);
            const doc = await docRef.get();
            if (doc.exists) {
                existingUsers.add(event.locals.userID);
                event.locals.userExists = true;
                event.locals.banned = doc.data()?.banned === true;
            } else {
                event.locals.userExists = false;
                event.locals.banned = false;
            }
            return resolve(event);
        }
    } catch (e) {
        console.error(e);
        event.locals.userID = null;
        event.locals.userExists = false;
        event.locals.banned = false;
        return resolve(event);
    }
}) satisfies Handle);
export const handleError = Sentry.handleErrorWithSentry();