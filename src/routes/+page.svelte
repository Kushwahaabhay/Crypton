<script lang="ts">
  import MatrixRain from '$lib/components/MatrixRain.svelte';
  import Countdown from 'svelte-countdown/src/index.js';
  const hexLines = ['0x4372797074', '0x6F6E323032', '0x35494954', '0x4D616472'];
</script>

<svelte:head>
  <title>Crypton — Where Code Meets Consciousness</title>
</svelte:head>

<MatrixRain />
<div class="scanlines" aria-hidden="true"></div>
<div class="vignette" aria-hidden="true"></div>
<div class="scanline-sweep" aria-hidden="true"></div>

<section class="relative min-h-screen flex flex-col items-center justify-center px-4 pt-16 overflow-hidden">

  <div class="absolute left-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-3" aria-hidden="true">
    {#each hexLines as hex}
      <span class="hex-text">{hex}</span>
    {/each}
  </div>

  <div class="relative z-10 mb-8 corner-brackets">
    <div class="glass-card px-6 py-2 flex items-center gap-3">
      <div class="w-16 h-px bg-gradient-to-r from-transparent to-primary/60"></div>
      <span class="font-mono text-[10px] tracking-[0.4em] uppercase text-white/60">
        Organized by <span class="text-primary">Team Kivy</span>
      </span>
      <div class="w-16 h-px bg-gradient-to-l from-transparent to-primary/60"></div>
    </div>
  </div>

  <div class="relative z-10 text-center mb-6">
    <h1
      class="glitch-text font-display font-black uppercase tracking-widest text-white select-none"
      data-text="CRYPTON"
      style="font-size: clamp(4rem, 15vw, 10rem); line-height: 1;"
    >
      CRYPTON
    </h1>
  </div>

  <p class="relative z-10 font-mono text-white/60 tracking-[0.3em] uppercase text-xs sm:text-sm mb-10">
    WHERE CODE MEETS CONSCIOUSNESS
  </p>

  <div class="relative z-10 mb-10 glass-card px-8 py-4 text-center">
    <p class="font-mono text-[10px] tracking-[0.4em] uppercase text-white/40 mb-2">Event ends in</p>
    <Countdown
      from="2026-03-29 20:00:00"
      dateFormat="YYYY-MM-DD H:m:s"
      zone="Asia/Kolkata"
      let:remaining
    >
      <div class="flex gap-6 font-mono text-primary">
        {#each [
          { val: remaining.days,    label: 'DAYS' },
          { val: remaining.hours,   label: 'HRS'  },
          { val: remaining.minutes, label: 'MIN'  },
          { val: remaining.seconds, label: 'SEC'  },
        ] as unit}
          <div class="flex flex-col items-center">
            <span class="text-2xl sm:text-3xl font-bold text-glow">{String(unit.val).padStart(2,'0')}</span>
            <span class="text-[9px] tracking-widest text-white/40 mt-1">{unit.label}</span>
          </div>
        {/each}
      </div>
    </Countdown>
  </div>

  <div class="relative z-10 flex flex-wrap gap-4 justify-center">
    <a
      href="/ready"
      class="register-btn font-mono text-sm tracking-widest uppercase px-8 py-3 bg-primary text-black font-bold border-2 border-primary transition-all duration-300 hover:shadow-[0_0_40px_rgba(19,236,73,0.5)]"
    >
      <span class="btn-label">ENTER THE MATRIX</span>
      <span class="btn-now">JACK IN</span>
    </a>
    <a
      href="/info"
      class="font-mono text-sm tracking-widest uppercase px-8 py-3 border border-white/20 text-white/70 hover:border-primary/50 hover:text-primary transition-all duration-300"
    >
      READ ME
    </a>
  </div>

</section>




