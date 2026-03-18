import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { dev } from '$app/environment';

export const POST = async ({ request, cookies }: { request: Request, cookies: any }) => {
    const body = await request.json();
    const password = body?.password ?? '';

    if (password.trim() === env.SITE_PASSWORD?.trim()) {
        cookies.set('__verified', '1', {
            path: '/',
            httpOnly: true,
            secure: !dev,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 365,
        });
        return json({ success: true });
    }

    return json({ success: false });
};
