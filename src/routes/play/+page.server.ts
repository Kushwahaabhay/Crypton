import { redirect } from '@sveltejs/kit';
import { adminDB } from '@/server/admin';

const collectionRef = adminDB.collection('/levels').orderBy('level');

let loaded = false;
let questions = [];

export const load = async ({ locals, setHeaders }) => {
  setHeaders({ 'cache-control': 'no-store' });
  if (!locals.userID || !locals.userExists) {
    return redirect(302, '/ready');
  }

  if (locals.banned) {
    return redirect(302, '/');
  }

  const userDoc = await adminDB.collection('/users').doc(locals.userID).get();
  const level = userDoc.data()!.level;

  const now = new Date();
  const startTime = new Date("2025-01-03T11:30:00Z");
  const endTime = new Date("2030-01-07T00:00:00Z");

  const questionsVisible = now >= startTime && now <= endTime;

  if (questionsVisible) {
    if (!loaded) {
      const querySnapshot = await collectionRef.get();
      querySnapshot.docs.forEach((d) => {
        let data = d.data();
        data['answer'] = null;
        data['creator'] = null;
        questions.push(data);
      });

      collectionRef.onSnapshot((newSnapshot) => {
        const newQuestions: any[] = [];
        newSnapshot.docs.forEach((d) => {
          let newData = d.data();
          newData['answer'] = null;
          newData['creator'] = null;
          newQuestions.push(newData);
        });
        questions = newQuestions;
        console.log('new update');
      });
      loaded = true;
    }
  }

  return {
    userID: locals.userID,
    questions: questions.slice(0, level),
  };
};

