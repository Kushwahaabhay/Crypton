<script lang="ts">
    import { ArrowLeft, ArrowRight, CheckCircle, Lock, List, XCircle } from "lucide-svelte";
    import { Doc } from "sveltefire";
    import Coin from "@tabler/icons-svelte/IconCoin.svelte";
    import { sendErrorToast, sendSuccessToast } from "$lib/toast_utils";
    import { browser } from "$app/environment";
    import { invalidateAll } from "$app/navigation";
    import MatrixRain from "$lib/components/MatrixRain.svelte";

    let loading = false;
    let answer = "";
    let showLogs = false;

    export let data;
    let questions = data.questions;
    let currQuestion = 0;
    $: currQuestionData = questions[currQuestion];

    const submitAnswer = async () => {
        loading = true;
        const r = await fetch(`/api/submit`, {
            method: "POST",
            body: JSON.stringify({
                answer,
                questionId: currQuestionData.uid,
            }),
        });
        if (r.ok) {
            const rdata = await r.json();
            if (rdata.correct) {
                sendSuccessToast("Level cleared", "Your answer was correct");
                await invalidateAll();
                questions = data.questions;
                if (currQuestion < questions.length - 1) currQuestion++;
            } else {
                sendErrorToast("Wrong answer", "Give it another shot");
            }
        } else {
            sendErrorToast("Error submitting", "Something went wrong");
        }
        loading = false;
    };

    const updateComment = () => {
        if (currQuestionData === null || currQuestionData === undefined) return;
        if (browser) {
            const e = document.getElementById(";)");
            if (e) {
                e.innerHTML = "";
                e.appendChild(document.createComment(currQuestionData.comment));
            }
        }
    };

    $: currQuestionData, updateComment();
</script>

<svelte:head>
    <title>Crypton — Play</title>
</svelte:head>

<MatrixRain />
<div class="scanlines" aria-hidden="true"></div>
<div class="vignette" aria-hidden="true"></div>
<div class="scanline-sweep" aria-hidden="true"></div>

{#if questions.length > 0}
    <Doc ref={`/users/${data.userID}`} let:data={userData}>
        <p slot="loading" class="fixed inset-0 flex items-center justify-center font-mono text-primary text-sm tracking-widest">LOADING...</p>

        <!-- Header -->
        <div class="fixed top-0 left-0 right-0 z-50 flex items-center gap-3 px-6 py-4 bg-[#050505]/95 backdrop-blur-xl border-b border-white/5">
            <a href="/" class="font-mono text-[11px] tracking-[0.2em] uppercase text-white/50 hover:text-primary transition-colors">← Home</a>
            <span class="font-mono text-primary/30 text-xs">|</span>
            <a href="/leaderboard" class="font-mono text-[11px] tracking-[0.2em] uppercase text-white/50 hover:text-primary transition-colors">Leaderboard</a>
            <div class="flex-1"></div>
            <!-- Coins -->
            <div class="flex items-center gap-1.5 font-mono text-xs text-primary/70">
                <Coin class="w-4 h-4" />
                <span>{(userData.level || 1) * 100 - 100}</span>
            </div>
            <span class="font-mono text-primary/30 text-xs">|</span>
            <!-- Prev answers -->
            <button
                class="font-mono text-[11px] tracking-[0.2em] uppercase text-white/50 hover:text-primary transition-colors flex items-center gap-1.5"
                on:click={() => showLogs = true}
            >
                <List class="w-3.5 h-3.5" />
                Prev Answers
            </button>
        </div>

        <!-- Main content -->
        <main class="relative min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-12">

            <!-- Level nav -->
            <div class="relative z-10 flex items-center gap-4 mb-8">
                <button
                    class="w-9 h-9 border border-white/10 flex items-center justify-center text-white/40 hover:border-primary/50 hover:text-primary transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                    disabled={currQuestion === 0}
                    on:click={() => { if (currQuestion > 0) currQuestion--; }}
                    aria-label="Previous level"
                >
                    <ArrowLeft class="w-4 h-4" />
                </button>

                <div class="font-mono text-sm tracking-widest uppercase
                    {(userData.completed_levels || []).includes(currQuestionData.uid) ? 'text-primary' : 'text-white/70'}">
                    Level {questions[currQuestion].level} / {questions.length}
                </div>

                <button
                    class="w-9 h-9 border border-white/10 flex items-center justify-center text-white/40 hover:border-primary/50 hover:text-primary transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                    on:click={() => { if (currQuestion < questions.length - 1) currQuestion++; }}
                    disabled={currQuestion === questions.length - 1 || !(userData.completed_levels || []).includes(currQuestionData.uid)}
                    aria-label="Next level"
                >
                    {#if !(userData.completed_levels || []).includes(currQuestionData.uid)}
                        <Lock class="w-4 h-4" />
                    {:else}
                        <ArrowRight class="w-4 h-4" />
                    {/if}
                </button>
            </div>

            <!-- Question card -->
            <div class="relative z-10 glass-card p-8 md:p-12 w-full max-w-2xl">
                <div class="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent rounded-t-2xl"></div>

                <p class="font-mono text-primary text-[10px] tracking-[0.4em] uppercase mb-6">
                    // LEVEL_{String(questions[currQuestion].level).padStart(2,'0')}
                </p>

                <!-- Prompt -->
                <p class="font-display text-white text-xl md:text-2xl leading-relaxed mb-8">{currQuestionData.prompt}</p>

                <!-- Files -->
                {#if currQuestionData.files && currQuestionData.files.length > 0}
                    <div class="mb-6">
                        <p class="font-mono text-[10px] tracking-widest uppercase text-white/40 mb-3">Attachments</p>
                        <div class="flex flex-wrap gap-2">
                            {#each currQuestionData.files as f}
                                <button
                                    class="font-mono text-xs text-primary border border-primary/30 px-3 py-1.5 hover:bg-primary/10 transition-colors"
                                    on:click={() => open(f.url)}
                                >
                                    {f.name}
                                </button>
                            {/each}
                        </div>
                    </div>
                {/if}

                <!-- Images -->
                {#if currQuestionData.images && currQuestionData.images.length > 0}
                    <div class="mb-8">
                        <p class="font-mono text-[10px] tracking-widest uppercase text-white/40 mb-3">Images</p>
                        <div class="flex flex-wrap gap-3">
                            {#each currQuestionData.images as img}
                                <img src={img} alt="Question image" class="rounded max-h-60 border border-white/10" />
                            {/each}
                        </div>
                    </div>
                {/if}

                <!-- Answer input or completed -->
                {#if !(userData.completed_levels || []).includes(currQuestionData.uid)}
                    <div class="mb-4">
                        <label class="font-mono text-[10px] tracking-widest uppercase text-white/40 block mb-2">Your Answer</label>
                        <input
                            class="w-full bg-black border border-white/10 text-white font-mono text-sm px-4 py-3 focus:outline-none focus:border-primary/50 transition-colors"
                            placeholder="..."
                            type="text"
                            bind:value={answer}
                            on:input={(e) => {
                                answer = e.currentTarget.value.replace(/[^a-z]/g, "");
                                e.currentTarget.value = answer;
                            }}
                            on:keydown={(e) => e.key === 'Enter' && !loading && submitAnswer()}
                        />
                    </div>
                    <button
                        class="w-full font-mono text-sm tracking-widest uppercase py-3 bg-primary text-black font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
                        disabled={loading}
                        on:click={submitAnswer}
                    >
                        {loading ? 'CHECKING...' : 'SUBMIT →'}
                    </button>
                {:else}
                    <div class="flex items-center gap-3 font-mono text-primary text-sm tracking-widest">
                        <CheckCircle class="w-5 h-5" />
                        LEVEL CLEARED
                    </div>
                {/if}

                <!-- Hidden comment node -->
                <span id=";)" class="hidden"></span>
            </div>
        </main>
    </Doc>
{:else}
    <main class="min-h-screen flex items-center justify-center">
        <p class="font-mono text-white/40 text-sm tracking-widest">// NO LEVELS AVAILABLE //</p>
    </main>
{/if}

<!-- Prev Answers Modal -->
{#if showLogs}
    <div class="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm" role="dialog" aria-modal="true">
        <div class="relative border border-white/10 bg-[#07070a] p-8 w-full max-w-sm shadow-2xl max-h-[80vh] flex flex-col">
            <div class="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary/60"></div>
            <div class="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary/60"></div>
            <div class="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary/60"></div>
            <div class="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary/60"></div>

            <div class="flex items-center justify-between mb-6">
                <div>
                    <p class="font-mono text-primary text-[10px] tracking-[0.4em] uppercase mb-0.5">HISTORY</p>
                    <h3 class="font-display text-white font-bold text-lg">Previous Answers</h3>
                </div>
                <button
                    class="w-8 h-8 border border-white/10 flex items-center justify-center text-white/40 hover:border-primary/50 hover:text-primary transition-all"
                    on:click={() => showLogs = false}
                    aria-label="Close"
                >
                    ✕
                </button>
            </div>

            <div class="overflow-y-auto flex-1 space-y-2">
                <Doc ref={`/logs/${data.userID}`} let:data={logData}>
                    <p slot="loading" class="font-mono text-white/40 text-xs tracking-widest">LOADING...</p>
                    {#each (logData?.logs ?? []) as log}
                        <div class="flex items-center gap-3 font-mono text-sm py-2 border-b border-white/5">
                            {#if log.type === "correct_answer"}
                                <CheckCircle class="w-4 h-4 text-primary flex-shrink-0" />
                                <span class="text-primary">{log.entered}</span>
                            {:else}
                                <XCircle class="w-4 h-4 text-red-500/70 flex-shrink-0" />
                                <span class="text-white/40">{log.entered}</span>
                            {/if}
                        </div>
                    {:else}
                        <p class="font-mono text-white/30 text-xs tracking-widest py-4 text-center">// NO ANSWERS YET //</p>
                    {/each}
                </Doc>
            </div>
        </div>
    </div>
{/if}
