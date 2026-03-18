import { redirect } from '@sveltejs/kit';
import { getAdminDB } from '$lib/server/admin';

let loaded = false;
let questions: any[] = [];

export const load = async ({ locals, setHeaders }: any) => {
    setHeaders({ 'cache-control': 'no-store' });
    if (!locals.userID || !locals.userExists) return redirect(302, '/ready');
    if (locals.banned) return redirect(302, '/');

    const db = getAdminDB();
    const userDoc = await db.collection('/users').doc(locals.userID).get();
    const level = userDoc.data()!.level;

    const now = new Date();
    const questionsVisible = now >= new Date("2025-01-03T11:30:00Z") && now <= new Date("2030-01-07T00:00:00Z");

    if (questionsVisible && !loaded) {
        const collectionRef = db.collection('/levels').orderBy('level');
        const querySnapshot = await collectionRef.get();
        questions = querySnapshot.docs.map((d: any) => {
            const data = d.data();
            data['answer'] = null;
            data['creator'] = null;
            return data;
        });
        collectionRef.onSnapshot((snap: any) => {
            questions = snap.docs.map((d: any) => {
                const data = d.data();
                data['answer'] = null;
                data['creator'] = null;
                return data;
            });
        });
        loaded = true;
    }

    return { userID: locals.userID, questions: questions.slice(0, level) };
};
