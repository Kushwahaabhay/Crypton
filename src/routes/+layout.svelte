<script lang="ts">
    import "../app.css"
    import {ToastContainer,BootstrapToast} from "svelte-toasts";
    import {auth,db,storage } from '$lib/firebase';
    import {FirebaseApp, } from "sveltefire";
    import {page} from '$app/stores';
    import { invalidateAll } from '$app/navigation';
    export let data;

    let passwordInput = '';
    let passwordError = false;
    let verifying = false;

    async function submitPassword() {
        verifying = true;
        passwordError = false;
        const res = await fetch('/api/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: passwordInput }),
        });
        const result = await res.json();
        if (result.success) {
            await invalidateAll();
        } else {
            passwordError = true;
        }
        verifying = false;
    }
</script>

<FirebaseApp {auth} firestore={db} {storage}>
    <ToastContainer let:data={data}>
        <BootstrapToast {data} />
    </ToastContainer>

    {#if !data.verified}
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
            <div class="relative border border-primary/20 bg-[#07070a] p-8 w-full max-w-sm shadow-2xl">
                <!-- Corner brackets -->
                <div class="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary/60"></div>
                <div class="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary/60"></div>
                <div class="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary/60"></div>
                <div class="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary/60"></div>
                <p class="font-mono text-primary text-[10px] tracking-[0.4em] uppercase mb-1">ACCESS CONTROL</p>
                <h2 class="font-display text-2xl font-black text-white mb-1">CHECK @KIVY.IN</h2>
                <p class="font-mono text-white/40 text-xs mb-6">Enter the access password to continue.</p>
                <input
                    type="password"
                    class="w-full mb-3 bg-black border border-white/10 text-white font-mono text-sm px-4 py-3 focus:outline-none focus:border-primary/50 transition-colors"
                    placeholder="_ _ _ _ _ _ _ _"
                    bind:value={passwordInput}
                    on:keydown={(e) => e.key === 'Enter' && submitPassword()}
                />
                {#if passwordError}
                    <p class="font-mono text-error text-xs mb-3 tracking-widest">// ACCESS DENIED //</p>
                {/if}
                <button
                    class="w-full font-mono text-sm tracking-widest uppercase py-3 bg-primary text-black font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
                    disabled={verifying}
                    on:click={submitPassword}
                >
                    {verifying ? 'VERIFYING...' : 'ENTER →'}
                </button>
            </div>
        </div>
    {:else}
        {#if ["/", "/leaderboard", "/info"].includes($page.url.pathname)}
        <div class="fixed top-0 left-0 right-0 z-50 flex items-center gap-4 px-6 py-4 bg-[#050505]/95 backdrop-blur-xl border-b border-white/5">
            <a class="font-mono text-[11px] tracking-[0.2em] uppercase transition-colors"
               class:text-primary={$page.url.pathname === "/"}
               class:text-white={$page.url.pathname !== "/"}
               href="/">Home</a>
            <span class="font-mono text-primary/30 text-xs">|</span>
            <a class="font-mono text-[11px] tracking-[0.2em] uppercase transition-colors"
               class:text-primary={$page.url.pathname === "/leaderboard"}
               class:text-white={$page.url.pathname !== "/leaderboard"}
               href="/leaderboard">Leaderboard</a>
            {#if data.banned === false && data.userExists}
            <span class="font-mono text-primary/30 text-xs">|</span>
            <a class="font-mono text-[11px] tracking-[0.2em] uppercase text-white/50 hover:text-primary transition-colors" href="/play">Play</a>
            {/if}
        </div>
        {/if}
        {#if ["/ready"].includes($page.url.pathname)}
            <div class="fixed top-0 left-0 right-0 z-50 flex items-center gap-4 px-6 py-4 bg-[#050505]/95 backdrop-blur-xl border-b border-white/5">
                <a class="font-mono text-[11px] tracking-[0.2em] uppercase text-white/50 hover:text-primary transition-colors" href="/">← Home</a>
            </div>
        {/if}
        <!-- /play has its own header rendered inside the page -->
        <slot />
    {/if}
</FirebaseApp>
