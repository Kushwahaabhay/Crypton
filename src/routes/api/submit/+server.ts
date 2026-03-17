import type { RequestHandler } from './$types';
import { error, json, redirect } from '@sveltejs/kit';
import { FieldValue } from 'firebase-admin/firestore';
import { adminDB } from '$lib/server/admin';

const questionsCollectionRef = adminDB.collection("/levels");
const questionMap = new Map<string, any>();
let loaded = false;


export const POST: RequestHandler = async ({ request, cookies, locals }) => {
    if (!loaded) {
        const querySnap = await questionsCollectionRef.get();
        querySnap.docs.forEach((q) => {
            questionMap.set(q.id, q.data());
        });
        questionsCollectionRef.onSnapshot((snap) => {
            snap.docs.forEach((q) => {
                questionMap.set(q.id, q.data());
            });
        });
        loaded = true;
    }

    if (!locals.userExists || locals.userID === null) return redirect(302, "/ready");
    let { questionId, answer } = await request.json();

    const userDoc = await adminDB.collection('/users').doc(locals.userID).get();
    const level = userDoc.data()!.level;
    let isAdmin = false;
    try {
        if (userDoc.exists) {
            const userData = userDoc.data();
            isAdmin = userData?.role === 'admin';
        } else {
            console.error('User not found in database');
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
    }

    const now = new Date();
    const startTime = new Date("2025-01-03T11:30:00Z");
    const endTime = new Date("2030-01-07T00:00:00Z");

    const questionsVisible = now >= startTime && now <= endTime;
    if (!isAdmin && !questionsVisible) return error(405, "Method Not Allowed");
    if (!questionMap.has(questionId)) return error(404, "Not Found");
    const submittedLevelDoc = await adminDB.collection('/levels').doc(questionId).get();
    const submittedLevel = submittedLevelDoc.data()!.level;
    if (level < submittedLevel) return error(405, "Method Not Allowed");
    if (answer === null || answer.trim() === "" || answer.length > 200) return error(400, "Bad Request");
    answer = answer.toLowerCase();
    let actualAnswer = questionMap.get(questionId).answer;
    let wasCorrect = false;
    await adminDB.runTransaction(async (transaction) => {
        const userRef = adminDB.collection("users").doc(locals.userID!);
        const userDocTx = await transaction.get(userRef);
        if (!userDocTx.exists) return error(500, "Something went wrong");
        const userData = userDocTx.data()!;
        let completedLevels: Array<string> = userData['completed_levels'] || [];
        if (completedLevels.includes(questionId)) return json({
            correct: true
        });
        const logRef = adminDB.collection("logs").doc(locals.userID!);
        if (answer === actualAnswer) {
            const next_level = userData.level + 1;
            await transaction.update(userRef, {
                "completed_levels": FieldValue.arrayUnion(questionId),
                "level": next_level,
                "last_change": FieldValue.serverTimestamp()
            });
            await transaction.set(logRef, {
                count: FieldValue.increment(1),
                logs: FieldValue.arrayUnion({
                    "timestamp": Date.now(),
                    "questionId": questionId,
                    "type": "correct_answer",
                    "entered": answer,
                    "userId": locals.userID!,
                })
            }, {
                merge: true
            });
            wasCorrect = true;

        } else {
            await transaction.set(logRef, {
                count: FieldValue.increment(1),
                logs: FieldValue.arrayUnion({
                    "timestamp": Date.now(),
                    "questionId": questionId,
                    "type": "wrong_answer",
                    "entered": answer,
                    "userId": locals.userID
                })
            }, {
                merge: true
            });
            wasCorrect = false;
        }
    });
    return json({
        "correct": wasCorrect
    })
};
