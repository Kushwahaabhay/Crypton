import { json } from '@sveltejs/kit';
import { getAdminDB, getAdminAuth } from '$lib/server/admin';

export const GET = async () => {
    let dbStatus = '', authStatus = '', err = '';
    try {
        const db = getAdminDB();
        await db.collection('_ping').limit(1).get();
        dbStatus = 'ok';
    } catch (e: any) { dbStatus = 'error'; err += 'DB:' + e?.message; }
    try {
        const auth = getAdminAuth();
        // just check it's callable
        authStatus = typeof auth.verifyIdToken === 'function' ? 'ok' : 'bad';
    } catch (e: any) { authStatus = 'error'; err += ' AUTH:' + e?.message; }
    return json({ db: dbStatus, auth: authStatus, err });
};
