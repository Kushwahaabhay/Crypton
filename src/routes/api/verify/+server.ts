import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { SITE_PASSWORD } from '$env/static/private';
import { dev } from '$app/environment';

export const POST: RequestHandler = async ({ request, cookies }) => {
    const { password } = await request.json();

    if (typeof password !== 'string' || password.trim() === '') {
        return error(400, 'Bad request');
    }

    if (password.trim() === SITE_PASSWORD) {
        cookies.set('__verified', '1', {
            path: '/',
            httpOnly: true,
            secure: !dev,
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 365,
        });
        return json({ success: true });
    }

    return json({ success: false });
};
