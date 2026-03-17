<script lang="ts">
  export let data;
  import MatrixRain from '$lib/components/MatrixRain.svelte';

  let leaders: any[] = [];
  let rest: any[] = [];

  if (data.leaderboard.length > 3) {
    leaders = data.leaderboard.slice(0, 3);
    rest = data.leaderboard.slice(3);
  } else {
    leaders = data.leaderboard;
    rest = [];
  }

  const medals = [
    { color: 'text-[#FEE101]', border: 'border-[#FEE101]/40', bg: 'bg-[#FEE101]/5', label: '01' },
    { color: 'text-[#D7D7D7]', border: 'border-[#D7D7D7]/40', bg: 'bg-[#D7D7D7]/5', label: '02' },
    { color: 'text-[#A77044]', border: 'border-[#A77044]/40', bg: 'bg-[#A77044]/5', label: '03' },
  ];
</script>

<svelte:head>
  <title>Crypton — Leaderboard</title>
</svelte:head>

<MatrixRain />
<div class="scanlines" aria-hidden="true"></div>
<div class="vignette" aria-hidden="true"></div>

<main class="relative min-h-screen pt-24 pb-16 px-4">
  <div class="max-w-4xl mx-auto">

    <!-- Header -->
    <div class="text-center mb-16">
      <p class="font-mono text-primary/80 text-[10px] tracking-[0.5em] uppercase mb-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/5 inline-block">
        CRYPTON · 2025
      </p>
      <h1 class="font-display font-black text-white uppercase tracking-widest select-none"
          style="font-size: clamp(2.5rem, 8vw, 5rem)">
        <span class="glitch-text" data-text="LEADERBOARD">LEADERBOARD</span>
      </h1>
      <div class="h-px w-24 mx-auto mt-6 bg-gradient-to-r from-transparent via-primary to-transparent" style="filter:blur(1px)"></div>
    </div>

    <!-- Top 3 -->
    {#if leaders.length > 0}
      <div class="flex flex-wrap justify-center gap-6 mb-16">
        {#each leaders as player, i}
          <div class="relative glass-card p-6 text-center w-56 overflow-hidden {medals[i]?.border ?? 'border-white/10'} hover:scale-105 transition-transform duration-300">
            <div class="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-current to-transparent {medals[i]?.color ?? ''}"></div>
            <div class="absolute -top-10 -right-10 w-24 h-24 rounded-full blur-2xl opacity-20 {medals[i]?.bg ?? ''}" aria-hidden="true"></div>

            <span class="font-mono text-4xl font-black {medals[i]?.color ?? 'text-white'} text-glow block mb-3">
              {medals[i]?.label ?? String(i+1).padStart(2,'0')}
            </span>
            <h3 class="font-display font-bold text-white text-lg break-words">{player.username}</h3>
            <p class="font-mono text-white/40 text-xs tracking-widest mt-2">{player.score} pts</p>
          </div>
        {/each}
      </div>
    {/if}

    <!-- Rest of leaderboard -->
    {#if rest.length > 0}
      <div class="glass-card overflow-hidden">
        <div class="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
        <table class="w-full">
          <thead>
            <tr class="border-b border-white/5">
              <th class="font-mono text-[10px] tracking-[0.3em] uppercase text-white/30 text-left px-6 py-4">Rank</th>
              <th class="font-mono text-[10px] tracking-[0.3em] uppercase text-white/30 text-left px-6 py-4">Player</th>
              <th class="font-mono text-[10px] tracking-[0.3em] uppercase text-white/30 text-right px-6 py-4">Score</th>
            </tr>
          </thead>
          <tbody>
            {#each rest as player, idx}
              <tr class="border-b border-white/5 hover:bg-primary/5 transition-colors">
                <td class="font-mono text-white/30 text-sm px-6 py-4">#{idx + 4}</td>
                <td class="font-display font-bold text-white px-6 py-4 break-words max-w-[200px]">{player.username}</td>
                <td class="font-mono text-primary text-sm text-right px-6 py-4">{player.score}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}

    {#if leaders.length === 0}
      <div class="text-center py-24">
        <p class="font-mono text-white/20 text-sm tracking-widest">// NO DATA YET. THE HUNT HAS NOT BEGUN. //</p>
      </div>
    {/if}

  </div>
</main>
