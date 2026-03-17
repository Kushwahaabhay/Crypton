<script lang="ts">
    export let data;
    import MatrixRain from '$lib/components/MatrixRain.svelte';
    import { IconBrandGoogle } from '@tabler/icons-svelte';
    import { sendErrorToast, sendSuccessToast } from '$lib/toast_utils';
    import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
    import { auth } from '$lib/firebase';
    import { goto, invalidateAll } from '$app/navigation';

    let isAuthLoading = false;
    let username = '';
    let firstname = '';
    let lastname = '';
    let loading = false;

    enum AccountState { GOOGLE_SIGN_IN, USERNAME_NAME, DONE }

    const getAccountStateFromStatCode = (loc: any) => {
        const code = (loc.userID === null ? 0 : 1) + (loc.userExists === false ? 0 : 1);
        if (code === 2) return AccountState.DONE;
        if (code === 1) return AccountState.USERNAME_NAME;
        return AccountState.GOOGLE_SIGN_IN;
    };

    $: accState = getAccountStateFromStatCode(data);
    $: progVal = accState === AccountState.GOOGLE_SIGN_IN ? 0 : accState === AccountState.USERNAME_NAME ? 50 : 100;

    async function signInWithGoogle() {
        isAuthLoading = true;
        const provider = new GoogleAuthProvider();
        const credential = await signInWithPopup(auth, provider);
        const idToken = await credential.user.getIdToken();
        await fetch('/api/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken }),
        });
        await invalidateAll();
        isAuthLoading = false;
    }

    async function updateNameUsername() {
        loading = true;
        if (username === '' || firstname === '' || lastname === '') {
            sendErrorToast('Required fields', 'Please fill all the fields.');
        } else {
            const r = await fetch('/api/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, first: firstname, last: lastname }),
            });
            if (r.status === 409 || r.status === 429) {
                sendErrorToast('Username taken', 'Please try a different one.');
            } else if (r.ok) {
                sendSuccessToast('Account created', '');
                await invalidateAll();
            } else {
                sendErrorToast('Error', 'Something went wrong, try again.');
            }
        }
        loading = false;
    }

    async function signoutSSR() {
        await fetch('/api/auth', { method: 'DELETE' });
        await signOut(auth);
        await invalidateAll();
    }
</script>

<svelte:head>
    <title>Crypton — Get Ready</title>
</svelte:head>

<MatrixRain />
<div class="scanlines" aria-hidden="true"></div>
<div class="vignette" aria-hidden="true"></div>
<div class="scanline-sweep" aria-hidden="true"></div>

<main class="relative min-h-screen flex flex-col items-center justify-center px-4 pt-16">

    <!-- Progress indicator -->
    <div class="relative z-10 flex items-center gap-3 mb-10">
        {#each [0, 50, 100] as step, i}
            <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full border-2 flex items-center justify-center font-mono text-xs transition-all duration-500
                    {progVal >= step ? 'border-primary bg-primary/10 text-primary' : 'border-white/20 text-white/30'}">
                    {i + 1}
                </div>
                {#if i < 2}
                    <div class="w-12 h-px transition-all duration-500 {progVal > step ? 'bg-primary' : 'bg-white/10'}"></div>
                {/if}
            </div>
        {/each}
    </div>

    <!-- Card -->
    <div class="relative z-10 glass-card p-8 md:p-12 w-full max-w-md">
        <div class="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent rounded-t-2xl"></div>

        {#if accState === AccountState.GOOGLE_SIGN_IN}
            <p class="font-mono text-primary text-[10px] tracking-[0.4em] uppercase mb-2">STEP 01</p>
            <h2 class="font-display font-black text-white text-2xl uppercase tracking-widest mb-1">Create Account</h2>
            <p class="text-white/40 text-xs font-mono mb-8">Use your IITM email for prize eligibility.</p>

            <button
                class="w-full flex items-center justify-center gap-3 font-mono text-sm tracking-widest uppercase py-3 border border-white/20 text-white/70 hover:border-primary/50 hover:text-primary transition-all duration-300 disabled:opacity-40"
                disabled={isAuthLoading}
                on:click={signInWithGoogle}
            >
                <IconBrandGoogle class="w-4 h-4" />
                {isAuthLoading ? 'SIGNING IN...' : 'SIGN IN WITH GOOGLE'}
            </button>
        {/if}

        {#if accState === AccountState.USERNAME_NAME}
            <p class="font-mono text-primary text-[10px] tracking-[0.4em] uppercase mb-2">STEP 02</p>
            <h2 class="font-display font-black text-white text-2xl uppercase tracking-widest mb-1">Your Identity</h2>
            <p class="text-white/40 text-xs font-mono mb-8">Choose your handle in the matrix.</p>

            <div class="flex gap-3 mb-4">
                <div class="flex-1">
                    <label class="font-mono text-[10px] tracking-widest uppercase text-white/40 block mb-2">First Name</label>
                    <input
                        class="w-full bg-black border border-white/10 text-white font-mono text-sm px-4 py-3 focus:outline-none focus:border-primary/50 transition-colors"
                        placeholder="Neo"
                        type="text"
                        on:input={(e) => { firstname = e.currentTarget.value.replace(/[^a-zA-Z]/g, ''); e.currentTarget.value = firstname; }}
                    />
                </div>
                <div class="flex-1">
                    <label class="font-mono text-[10px] tracking-widest uppercase text-white/40 block mb-2">Last Name</label>
                    <input
                        class="w-full bg-black border border-white/10 text-white font-mono text-sm px-4 py-3 focus:outline-none focus:border-primary/50 transition-colors"
                        placeholder="Anderson"
                        type="text"
                        on:input={(e) => { lastname = e.currentTarget.value.replace(/[^a-zA-Z]/g, ''); e.currentTarget.value = lastname; }}
                    />
                </div>
            </div>
            <div class="mb-6">
                <label class="font-mono text-[10px] tracking-widest uppercase text-white/40 block mb-2">Username</label>
                <input
                    class="w-full bg-black border border-white/10 text-white font-mono text-sm px-4 py-3 focus:outline-none focus:border-primary/50 transition-colors"
                    placeholder="TheOne"
                    type="text"
                    on:input={(e) => { username = e.currentTarget.value.replace(/[^a-zA-Z0-9]/g, ''); e.currentTarget.value = username; }}
                />
            </div>
            <button
                class="w-full font-mono text-sm tracking-widest uppercase py-3 bg-primary text-black font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
                disabled={loading}
                on:click={updateNameUsername}
            >
                {loading ? 'LOADING...' : 'NEXT →'}
            </button>
        {/if}

        {#if accState === AccountState.DONE}
            <p class="font-mono text-primary text-[10px] tracking-[0.4em] uppercase mb-2">STEP 03</p>
            <h2 class="font-display font-black text-white text-2xl uppercase tracking-widest mb-1">You're In</h2>
            <p class="text-white/40 text-xs font-mono mb-8">The matrix awaits. Good luck, hunter.</p>

            <button
                class="w-full font-mono text-sm tracking-widest uppercase py-3 bg-primary text-black font-bold hover:bg-primary/90 transition-colors mb-3"
                on:click={async () => await goto('/play')}
            >
                START PLAYING →
            </button>
            <button
                class="w-full font-mono text-sm tracking-widest uppercase py-3 border border-white/10 text-white/40 hover:border-white/20 hover:text-white/60 transition-colors"
                on:click={signoutSSR}
            >
                LOG OUT
            </button>
        {/if}
    </div>

</main>
