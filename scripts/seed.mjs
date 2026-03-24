import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
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

async function seed() {
    const indexRef = db.collection('index');

    await indexRef.doc('nameIndex').set({ usernames: [] }, { merge: true });
    console.log('✓ index/nameIndex created');

    await indexRef.doc('userIndex').set({}, { merge: true });
    console.log('✓ index/userIndex created');

    // Question 3
    const levelRef3 = db.collection('levels').doc('level_3');
    await levelRef3.set({
        uid: 'level_3',
        level: 3,
        prompt: 'Not all numbers are numeric: 4092680860887607367530468603466728771',
        answer: 'galaxy',
        comment: 'na',
        files: [],
        images: [],
    });
    console.log('✓ levels/level_3 created');

    console.log('Seeding complete.');
    process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
