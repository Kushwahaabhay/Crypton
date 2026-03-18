import { getAdminAuth } from '$lib/server/admin';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { dev } from '$app/environment';

export const POST: RequestHandler = async ({ request, cookies }) => {
    const { idToken } = await request.json();
    const expiresIn = 60 * 60 * 24 * 7 * 1000;
    try {
        const auth = getAdminAuth();
        const decodedIdToken = await auth.verifyIdToken(idToken);
        // Allow up to 1 hour since last sign-in (was 5 min — too strict)
        if (new Date().getTime() / 1000 - decodedIdToken.auth_time < 60 * 60) {
            const cookie = await auth.createSessionCookie(idToken, { expiresIn });
            cookies.set('__session', cookie, { maxAge: expiresIn, httpOnly: true, secure: !dev, path: '/' });
            return json({ status: 'signedIn' });
        } else {
            return error(401, 'Recent sign in required');
        }
    } catch (e: any) {
        console.error('Auth error:', e?.message);
        return error(500, e?.message ?? 'Auth failed');
    }
};

export const DELETE: RequestHandler = async ({ cookies }) => {
    cookies.delete('__session', { path: '/' });
    return json({ status: 'signedOut' });
};
