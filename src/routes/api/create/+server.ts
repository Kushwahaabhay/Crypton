import type { RequestHandler } from './$types';
import { getAdminDB } from '$lib/server/admin';
import { FieldValue } from 'firebase-admin/firestore';
import { error, json } from '@sveltejs/kit';

let existingUsernames = new Set<string>();
let existingUsernamesLoaded = false;

export const POST: RequestHandler = async ({ request, locals }) => {
    const db = getAdminDB();
    const indexRef = db.collection("index").doc('nameIndex');

    if (!existingUsernamesLoaded) {
        const data = (await indexRef.get()).data();
        if (data) data['usernames']?.forEach((u: string) => existingUsernames.add(u));
        existingUsernamesLoaded = true;
    }

    if (locals.userID === null) return error(401, 'Unauthorized');

    const body = await request.json();
    const { first, last, username } = body;

    if (typeof first !== 'string' || typeof last !== 'string' || typeof username !== 'string')
        return error(400, 'Invalid request');
    if (first.length > 50 || last.length > 50 || username.length > 30)
        return error(400, 'Fields too long');
    if (!/^[a-zA-Z]+$/.test(first) || !/^[a-zA-Z]+$/.test(last) || !/^[a-zA-Z0-9]+$/.test(username))
        return error(400, 'Invalid characters');
    if (existingUsernames.has(username.toLowerCase()))
        return error(409, 'Username already exists');

    existingUsernames.add(username.toLowerCase());
    await db.runTransaction(async (transaction) => {
        const userRef = db.collection('users').doc(locals.userID!);
        await transaction.set(userRef, {
            first, last,
            username: username.toLowerCase(),
            uid: locals.userID,
            created: FieldValue.serverTimestamp(),
            level: 1,
            completed_levels: [],
            banned: false,
            last_change: FieldValue.serverTimestamp(),
        });
        await transaction.update(indexRef, { usernames: FieldValue.arrayUnion(username.toLowerCase()) });
        await transaction.update(db.collection('index').doc('userIndex'), { [locals.userID!]: true });
    });

    return json({ success: true });
};
