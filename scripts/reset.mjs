import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { config } from 'dotenv';

config({ path: '.env' });

initializeApp({
    credential: cert({
        projectId: process.env.FB_PROJECT_ID,
        clientEmail: process.env.FB_CLIENT_EMAIL,
        privateKey: process.env.FB_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    })
});

const db = getFirestore();
const auth = getAuth();

async function deleteCollection(colPath) {
    const snap = await db.collection(colPath).get();
    if (snap.empty) { console.log(`  (empty) ${colPath}`); return; }
    const batch = db.batch();
    snap.docs.forEach(d => batch.delete(d.ref));
    await batch.commit();
    console.log(`✓ deleted ${snap.size} docs from ${colPath}`);
}

async function deleteAllAuthUsers() {
    let deleted = 0;
    let pageToken;
    do {
        const result = await auth.listUsers(1000, pageToken);
        if (result.users.length) {
            await auth.deleteUsers(result.users.map(u => u.uid));
            deleted += result.users.length;
        }
        pageToken = result.pageToken;
    } while (pageToken);
    console.log(`✓ deleted ${deleted} auth users`);
}

async function reset() {
    console.log('Clearing Firestore collections...');
    await deleteCollection('users');
    await deleteCollection('logs');

    // Reset index docs
    await db.collection('index').doc('nameIndex').set({ usernames: [] });
    await db.collection('index').doc('userIndex').set({});
    console.log('✓ reset index/nameIndex and index/userIndex');

    console.log('Clearing Firebase Auth users...');
    await deleteAllAuthUsers();

    console.log('\nReset complete.');
    process.exit(0);
}

reset().catch(e => { console.error(e); process.exit(1); });
