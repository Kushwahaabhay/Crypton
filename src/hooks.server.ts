import { sequence } from "@sveltejs/kit/hooks";
import * as Sentry from "@sentry/sveltekit";
import { getAdminAuth, getAdminDB } from "$lib/server/admin";
import type { Handle } from "@sveltejs/kit";
import { PUBLIC_SENTRY_DSN } from '$env/static/public';

Sentry.init({ dsn: PUBLIC_SENTRY_DSN, tracesSampleRate: 1 });

let existingUsers = new Set<string>();
let bannedUsers = new Set<string>();
let indexLoaded = false;

export const handle = sequence(Sentry.sentryHandle(), (async ({ event, resolve }) => {
    if (event.url.pathname.startsWith('/api/verify')) {
        event.locals.verified = true;
        event.locals.userID = null;
        event.locals.userExists = false;
        event.locals.banned = false;
        return resolve(event);
    }

    const verified = event.cookies.get('__verified');
    if (verified !== '1') {
        event.locals.userID = null;
        event.locals.userExists = false;
        event.locals.banned = false;
        event.locals.verified = false;
        return resolve(event);
    }

    event.locals.verified = true;
    const db = getAdminDB();

    if (!indexLoaded) {
        const userIndexRef = db.collection("index").doc('userIndex');
        const bannedUsersQuery = db.collection("users").where("banned", "==", true);
        const doc = await userIndexRef.get();
        const qSnap = await bannedUsersQuery.get();
        qSnap.docs.forEach((e: any) => bannedUsers.add(e.id));
        if (doc.exists) {
            const data = doc.data();
            if (data) Object.keys(data).forEach(uid => existingUsers.add(uid));
        }
        userIndexRef.onSnapshot((snap: any) => {
            existingUsers = new Set(Object.keys(snap.data() || {}));
        });
        bannedUsersQuery.onSnapshot((snap: any) => {
            bannedUsers.clear();
            snap.docs.forEach((e: any) => bannedUsers.add(e.id));
        });
        indexLoaded = true;
    }

    const sessionCookie = event.cookies.get("__session");
    if (!sessionCookie) {
        event.locals.userID = null;
        event.locals.userExists = false;
        event.locals.banned = false;
        return resolve(event);
    }

    try {
        const auth = getAdminAuth();
        const decodedClaims = await auth.verifySessionCookie(sessionCookie);
        event.locals.userID = decodedClaims.uid;
        if (existingUsers.has(decodedClaims.uid)) {
            event.locals.userExists = true;
            event.locals.banned = bannedUsers.has(decodedClaims.uid);
        } else {
            const doc = await db.collection('users').doc(decodedClaims.uid).get();
            if (doc.exists) {
                existingUsers.add(decodedClaims.uid);
                event.locals.userExists = true;
                event.locals.banned = doc.data()?.banned === true;
            } else {
                event.locals.userExists = false;
                event.locals.banned = false;
            }
        }
    } catch (e) {
        console.error(e);
        event.locals.userID = null;
        event.locals.userExists = false;
        event.locals.banned = false;
    }
    return resolve(event);
}) satisfies Handle);

export const handleError = Sentry.handleErrorWithSentry();
