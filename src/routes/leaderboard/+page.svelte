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

  const medals = [];
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
        CRYPTON · 2026
      </p>
      <h1 class="font-display font-black text-white uppercase tracking-widest select-none"
          style="font-size: clamp(2.5rem, 8vw, 5rem)">
        <span class="glitch-text" data-text="LEADERBOARD">LEADERBOARD</span>
      </h1>
      <div class="h-px w-24 mx-auto mt-6 bg-gradient-to-r from-transparent via-primary to-transparent" style="filter:blur(1px)"></div>
    </div>

    <!-- Top 3 Podium -->
    {#if leaders.length > 0}
      <!-- Mobile: stacked with #01 on top; Desktop: side-by-side podium -->
      <div class="mb-16">
        <!-- Desktop podium -->
        <div class="hidden sm:flex items-end justify-center gap-4">
          <!-- #02 -->
          {#if leaders[1]}
            <div class="relative w-44 md:w-52 bg-[#0d0d0d] border border-white/10 p-4 md:p-5 self-end" style="margin-bottom: 2rem;">
              <span class="absolute top-3 right-3 font-mono text-3xl font-black text-white/10 select-none">#02</span>
              <div class="w-16 h-16 md:w-20 md:h-20 border border-white/20 bg-white/5 flex items-center justify-center mb-3 mx-auto">
                <span class="font-mono text-white/20 text-xl font-black">{leaders[1].username[0].toUpperCase()}</span>
              </div>
              <h3 class="font-mono font-bold text-white text-xs tracking-widest uppercase text-center break-words mb-1">{leaders[1].username}</h3>
              <p class="font-mono text-primary text-[9px] tracking-[0.2em] uppercase text-center mb-3">RANK_02_OPERATOR</p>
              <div class="border-t border-white/5 pt-3 flex justify-between">
                <div>
                  <p class="font-mono text-[8px] tracking-widest text-white/30 uppercase mb-1">XP</p>
                  <p class="font-mono text-white font-bold text-xs">{leaders[1].score.toLocaleString()}</p>
                </div>
                <div>
                  <p class="font-mono text-[8px] tracking-widest text-white/30 uppercase mb-1">LVL</p>
                  <p class="font-mono text-white font-bold text-xs">{Math.floor(leaders[1].score / 100) + 1}</p>
                </div>
              </div>
            </div>
          {/if}

          <!-- #01 -->
          <div class="relative w-48 md:w-56 bg-[#0d0d0d] border border-primary/40 p-5 md:p-6 z-10">
            <div class="absolute bottom-0 inset-x-0 h-0.5 bg-primary"></div>
            <span class="absolute top-3 right-3 font-mono text-3xl font-black text-primary/20 select-none">#01</span>
            <div class="w-20 h-20 md:w-24 md:h-24 border-2 border-primary/60 bg-primary/5 flex items-center justify-center mb-4 mx-auto">
              <span class="font-mono text-primary/60 text-2xl md:text-3xl font-black">{leaders[0].username[0].toUpperCase()}</span>
            </div>
            <h3 class="font-mono font-bold text-white text-xs tracking-widest uppercase text-center break-words mb-1">{leaders[0].username}</h3>
            <p class="font-mono text-primary text-[9px] tracking-[0.2em] uppercase text-center mb-3">RANK_01_OPERATOR</p>
            <div class="border-t border-primary/20 pt-3 flex justify-between mb-4">
              <div>
                <p class="font-mono text-[8px] tracking-widest text-white/30 uppercase mb-1">XP</p>
                <p class="font-mono text-primary font-bold text-sm">{leaders[0].score.toLocaleString()}</p>
              </div>
              <div>
                <p class="font-mono text-[8px] tracking-widest text-white/30 uppercase mb-1">LVL</p>
                <p class="font-mono text-white font-bold text-sm">{Math.floor(leaders[0].score / 100) + 1}</p>
              </div>
            </div>
            <div class="w-full bg-primary text-black font-mono text-[9px] tracking-[0.3em] uppercase font-bold py-2 text-center">
              🏎️ SMOOTH_OPERATOR
            </div>
          </div>

          <!-- #03 -->
          {#if leaders[2]}
            <div class="relative w-44 md:w-52 bg-[#0d0d0d] border border-white/10 p-4 md:p-5 self-end" style="margin-bottom: 2rem;">
              <span class="absolute top-3 right-3 font-mono text-3xl font-black text-white/10 select-none">#03</span>
              <div class="w-16 h-16 md:w-20 md:h-20 border border-white/20 bg-white/5 flex items-center justify-center mb-3 mx-auto">
                <span class="font-mono text-white/20 text-xl font-black">{leaders[2].username[0].toUpperCase()}</span>
              </div>
              <h3 class="font-mono font-bold text-white text-xs tracking-widest uppercase text-center break-words mb-1">{leaders[2].username}</h3>
              <p class="font-mono text-primary text-[9px] tracking-[0.2em] uppercase text-center mb-3">RANK_03_OPERATOR</p>
              <div class="border-t border-white/5 pt-3 flex justify-between">
                <div>
                  <p class="font-mono text-[8px] tracking-widest text-white/30 uppercase mb-1">XP</p>
                  <p class="font-mono text-white font-bold text-xs">{leaders[2].score.toLocaleString()}</p>
                </div>
                <div>
                  <p class="font-mono text-[8px] tracking-widest text-white/30 uppercase mb-1">LVL</p>
                  <p class="font-mono text-white font-bold text-xs">{Math.floor(leaders[2].score / 100) + 1}</p>
                </div>
              </div>
            </div>
          {/if}
        </div>

        <!-- Mobile: stacked list -->
        <div class="flex flex-col gap-3 sm:hidden">
          {#each leaders as player, i}
            {@const isFirst = i === 0}
            <div class="relative bg-[#0d0d0d] border {isFirst ? 'border-primary/40' : 'border-white/10'} p-4 flex items-center gap-4">
              {#if isFirst}<div class="absolute bottom-0 inset-x-0 h-0.5 bg-primary"></div>{/if}
              <span class="font-mono text-2xl font-black {isFirst ? 'text-primary/40' : 'text-white/10'} w-10 shrink-0">#{String(i+1).padStart(2,'0')}</span>
              <div class="w-12 h-12 border {isFirst ? 'border-primary/60 bg-primary/5' : 'border-white/20 bg-white/5'} flex items-center justify-center shrink-0">
                <span class="font-mono {isFirst ? 'text-primary/60' : 'text-white/20'} text-lg font-black">{player.username[0].toUpperCase()}</span>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="font-mono font-bold text-white text-xs tracking-widest uppercase truncate">{player.username}</h3>
                <p class="font-mono text-primary text-[9px] tracking-widest uppercase mt-0.5">RANK_0{i+1}_OPERATOR</p>
              </div>
              <div class="text-right shrink-0">
                <p class="font-mono {isFirst ? 'text-primary' : 'text-white'} font-bold text-sm">{player.score.toLocaleString()}</p>
                <p class="font-mono text-white/30 text-[9px] uppercase tracking-widest">LVL {Math.floor(player.score / 100) + 1}</p>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    <!-- Rest of leaderboard -->
    {#if rest.length > 0}
      <div class="glass-card overflow-hidden">
        <div class="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
        <!-- Desktop table -->
        <table class="hidden sm:table w-full">
          <thead>
            <tr class="border-b border-white/5">
              <th class="font-mono text-[9px] tracking-[0.3em] uppercase text-white/30 text-left px-6 py-4">Rank</th>
              <th class="font-mono text-[9px] tracking-[0.3em] uppercase text-white/30 text-left px-6 py-4">Operator_ID</th>
              <th class="font-mono text-[9px] tracking-[0.3em] uppercase text-white/30 text-right px-6 py-4">System_XP</th>
              <th class="font-mono text-[9px] tracking-[0.3em] uppercase text-white/30 text-right px-6 py-4">Level</th>
            </tr>
          </thead>
          <tbody>
            {#each rest as player, idx}
              <tr class="border-b border-white/5 hover:bg-primary/5 transition-colors">
                <td class="font-mono text-white/30 text-sm px-6 py-4">#{String(idx + 4).padStart(2,'0')}</td>
                <td class="font-mono font-bold text-white px-6 py-4 break-words max-w-[200px] uppercase tracking-widest text-sm">{player.username}</td>
                <td class="font-mono text-primary text-sm text-right px-6 py-4">{player.score.toLocaleString()}</td>
                <td class="font-mono text-white/50 text-sm text-right px-6 py-4">{Math.floor(player.score / 100) + 1}</td>
              </tr>
            {/each}
          </tbody>
        </table>
        <!-- Mobile list -->
        <div class="sm:hidden divide-y divide-white/5">
          {#each rest as player, idx}
            <div class="flex items-center gap-3 px-4 py-3">
              <span class="font-mono text-white/30 text-xs w-8 shrink-0">#{String(idx + 4).padStart(2,'0')}</span>
              <span class="font-mono font-bold text-white text-xs uppercase tracking-widest flex-1 truncate">{player.username}</span>
              <span class="font-mono text-primary text-xs shrink-0">{player.score.toLocaleString()}</span>
              <span class="font-mono text-white/30 text-xs shrink-0 w-8 text-right">L{Math.floor(player.score / 100) + 1}</span>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    {#if leaders.length === 0}
      <div class="text-center py-24">
        <p class="font-mono text-white/20 text-sm tracking-widest">// NO DATA YET. THE HUNT HAS NOT BEGUN. //</p>
      </div>
    {/if}

  </div>
</main>
