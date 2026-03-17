/** @type {import('./$types').PageLoad} */
import {adminDB} from "@/server/admin";
let loaded = false;
let leaderboard = [];
let queryDef = adminDB.collection("users").orderBy("level","desc").orderBy("last_change");

export const load
    = (async ({ locals, params }) => {
        if(!loaded){
            const qSnap = await queryDef.get();
            qSnap.docs.forEach((e)=>{
                const data = e.data();
                leaderboard.push({
                    username: data.username,
                    score: (data.level-1) * 100,
                });
            });
            queryDef.onSnapshot((snap)=>{
                const newData = [];
                snap.docs.forEach((e)=>{
                    const data = e.data();
                    newData.push({
                        username: data.username,
                        score: (data.level-1) * 100,
                    });
                });
                leaderboard = newData;
            });
            loaded=true;
        }
        return {
            leaderboard
        };
});

