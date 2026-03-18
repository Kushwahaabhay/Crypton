import type { RequestHandler } from './$types';
import { error, json, redirect } from '@sveltejs/kit';
import { FieldValue } from 'firebase-admin/firestore';
import { getAdminDB } from '$lib/server/admin';

const questionMap = new Map<string, any>();
let loaded = false;

export const POST: RequestHandler = async ({ request, locals }) => {
    if (!locals.userExists || locals.userID === null) return redirect(302, "/ready");

    const db = getAdminDB();

    if (!loaded) {
        const snap = await db.collection("/levels").get();
        snap.docs.forEach((q: any) => questionMap.set(q.id, q.data()));
        db.collection("/levels").onSnapshot((snap: any) => {
            snap.docs.forEach((q: any) => questionMap.set(q.id, q.data()));
        });
        loaded = true;
    }

    const { questionId, answer: rawAnswer } = await request.json();
    if (!rawAnswer || rawAnswer.trim() === "" || rawAnswer.length > 200) return error(400, "Bad Request");
    const answer = rawAnswer.toLowerCase();

    const userDoc = await db.collection('/users').doc(locals.userID).get();
    const level = userDoc.data()!.level;
    const isAdmin = userDoc.data()?.role === 'admin';

    const now = new Date();
    const questionsVisible = now >= new Date("2025-01-03T11:30:00Z") && now <= new Date("2030-01-07T00:00:00Z");
    if (!isAdmin && !questionsVisible) return error(405, "Method Not Allowed");
    if (!questionMap.has(questionId)) return error(404, "Not Found");

    const submittedLevel = (await db.collection('/levels').doc(questionId).get()).data()!.level;
    if (level < submittedLevel) return error(405, "Method Not Allowed");

    const actualAnswer = questionMap.get(questionId).answer;
    let wasCorrect = false;

    await db.runTransaction(async (transaction) => {
        const userRef = db.collection("users").doc(locals.userID!);
        const logRef = db.collection("logs").doc(locals.userID!);
        const userDocTx = await transaction.get(userRef);
        if (!userDocTx.exists) return;
        const userData = userDocTx.data()!;
        const completedLevels: string[] = userData['completed_levels'] || [];
        if (completedLevels.includes(questionId)) { wasCorrect = true; return; }

        const logEntry = { timestamp: Date.now(), questionId, entered: answer, userId: locals.userID! };
        if (answer === actualAnswer) {
            transaction.update(userRef, {
                completed_levels: FieldValue.arrayUnion(questionId),
                level: userData.level + 1,
                last_change: FieldValue.serverTimestamp(),
            });
            transaction.set(logRef, { count: FieldValue.increment(1), logs: FieldValue.arrayUnion({ ...logEntry, type: "correct_answer" }) }, { merge: true });
            wasCorrect = true;
        } else {
            transaction.set(logRef, { count: FieldValue.increment(1), logs: FieldValue.arrayUnion({ ...logEntry, type: "wrong_answer" }) }, { merge: true });
        }
    });

    return json({ correct: wasCorrect });
};
