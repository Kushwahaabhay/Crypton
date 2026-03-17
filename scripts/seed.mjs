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

    // Dummy question 1
    const levelRef = db.collection('levels').doc('level_1');
    await levelRef.set({
        uid: 'level_1',
        level: 1,
        prompt: 'What is the output of: print("hello world") in Python? (one word, lowercase)',
        answer: 'hello',
        comment: 'Hint: just the first word',
        files: [],
        images: [],
    });
    console.log('✓ levels/level_1 created');

    // Dummy question 2
    const levelRef2 = db.collection('levels').doc('level_2');
    await levelRef2.set({
        uid: 'level_2',
        level: 2,
        prompt: 'I speak without a mouth and hear without ears. I have no body, but I come alive with the wind. What am I?',
        answer: 'echo',
        comment: 'Think about what happens in a cave or a canyon when you shout...',
        files: [],
        images: [],
    });
    console.log('✓ levels/level_2 created');

    console.log('Seeding complete.');
    process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
