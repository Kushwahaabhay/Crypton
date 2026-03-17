/** @type {import('./$types').PageLoad} */
export const load = (async ({ locals }) => {
    return {
        userID: locals.userID,
        userExists: locals.userExists,
        banned: locals.banned,
        verified: locals.verified,
    };
});