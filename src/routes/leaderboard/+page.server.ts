import { getAdminDB } from "$lib/server/admin";

let loaded = false;
let leaderboard: { username: string; score: number }[] = [];

export const load = async () => {
    if (!loaded) {
        const db = getAdminDB();
        const queryDef = db.collection("users").orderBy("level", "desc").orderBy("last_change");
        const qSnap = await queryDef.get();
        leaderboard = qSnap.docs.map((e) => {
            const data = e.data();
            return { username: data.username, score: (data.level - 1) * 100 };
        });
        queryDef.onSnapshot((snap) => {
            leaderboard = snap.docs.map((e) => {
                const data = e.data();
                return { username: data.username, score: (data.level - 1) * 100 };
            });
        });
        loaded = true;
    }
    return { leaderboard };
};
