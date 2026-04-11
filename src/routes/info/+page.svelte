<script lang="ts">
  import MatrixRain from '$lib/components/MatrixRain.svelte';
  import { onMount } from 'svelte';

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add('section-visible');
      }),
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    document.querySelectorAll('.reveal-on-scroll').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  });
</script>

<svelte:head>
  <title>Crypton — Read Me</title>
</svelte:head>

<MatrixRain />
<div class="scanlines" aria-hidden="true"></div>
<div class="vignette" aria-hidden="true"></div>

<main class="relative pt-24 pb-16 px-4">
  <div class="max-w-4xl mx-auto">

    <!-- Header -->
    <div class="text-center mb-16 reveal-on-scroll">
      <p class="font-mono text-primary/80 text-[10px] tracking-[0.5em] uppercase mb-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/5 inline-block">
        CRYPTON · READ ME
      </p>
      <h1 class="font-display font-black text-white uppercase tracking-widest select-none"
          style="font-size: clamp(2.5rem, 8vw, 5rem)">
        <span class="glitch-text" data-text="WHAT IS CRYPTON?">WHAT IS CRYPTON?</span>
      </h1>
      <div class="h-px w-24 mx-auto mt-6 bg-gradient-to-r from-transparent via-primary to-transparent" style="filter:blur(1px)"></div>
    </div>

    <!-- About -->
    <div class="glass-card p-8 md:p-12 relative overflow-hidden mb-8 reveal-on-scroll">
      <div class="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
      <div class="absolute -top-20 -right-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl" aria-hidden="true"></div>

      <div class="grid md:grid-cols-2 gap-10 relative z-10">
        <div>
          <h3 class="font-mono text-primary text-xs tracking-[0.3em] uppercase mb-4">The Event</h3>
          <p class="text-white/70 text-sm leading-relaxed">
            Crypton is an online cryptic hunt event hosted during Vibecon 2026 at Galgotias.
            Participants has to tackle a series of challenging levels, deciphering clues and solving
            riddles to progress. The event tests wit, collaboration, and problem-solving skills.
          </p>
        </div>
        <div>
          <h3 class="font-mono text-primary text-xs tracking-[0.3em] uppercase mb-4">What's a Cryptic Hunt?</h3>
          <p class="text-white/70 text-sm leading-relaxed">
            A puzzle-solving game where you solve riddles and challenges to move from one hint to the next.
            It involves creative thinking, wordplay, pattern interpretation, and online exploration.
            Cipher coders, AI tools, QR codes — all allowed and encouraged.
          </p>
        </div>
      </div>

      <div class="mt-8 pt-8 border-t border-white/5 relative z-10">
        <h3 class="font-mono text-primary text-xs tracking-[0.3em] uppercase mb-4">How Winners Are Decided</h3>
        <p class="text-white/70 text-sm leading-relaxed">
          Winners are ranked by the leaderboard at the end of the competition. Players who solve puzzles
          faster are placed higher. Accuracy is not a criteria — speed is everything.
        </p>
      </div>
    </div>

    <!-- Rules & Guidelines -->
    <div class="grid md:grid-cols-2 gap-6 mb-8">
      <div class="glass-card p-6 relative overflow-hidden reveal-on-scroll">
        <div class="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
        <h3 class="font-mono text-primary text-xs tracking-[0.3em] uppercase mb-6">Rules</h3>
        <ul class="space-y-3 text-white/70 text-sm">
          {#each [
            'Register with email.',
            'Join the official Whatsapp Group.',
            'Sharing answers or hints with other players = disqualification.',
            'Reverse engineering the platform = instant ban.',
            'No obscene or offensive usernames.',
            'Organizer decisions are final.',
          ] as rule, i}
            <li class="flex gap-3">
              <span class="font-mono text-primary/50 text-xs mt-0.5 shrink-0">{String(i+1).padStart(2,'0')}</span>
              <span>{rule}</span>
            </li>
          {/each}
        </ul>
      </div>

      <div class="glass-card p-6 relative overflow-hidden reveal-on-scroll">
        <div class="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent-purple/30 to-transparent"></div>
        <h3 class="font-mono text-accent-purple text-xs tracking-[0.3em] uppercase mb-6">Guidelines</h3>
        <ul class="space-y-3 text-white/70 text-sm">
          {#each [
            'Report misconduct by DMing any team member.',
            "You will not get any helps from Organizer.",
            "They don't know the any answer, this is designed team Kivy.",
            'Every answers are in lower case.',
            'Answer and lead sharing is strictly prohibited.',
            "File passwords allow all characters — brute forcing won't help.",
          ] as guide, i}
            <li class="flex gap-3">
              <span class="font-mono text-accent-purple/50 text-xs mt-0.5 shrink-0">{String(i+1).padStart(2,'0')}</span>
              <span>{guide}</span>
            </li>
          {/each}
        </ul>
      </div>
    </div>

    <!-- Resources -->
    <div class="glass-card p-8 md:p-12 relative overflow-hidden mb-8 reveal-on-scroll">
      <div class="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent-blue/30 to-transparent"></div>
      <div class="absolute -top-20 -right-20 w-40 h-40 bg-accent-blue/5 rounded-full blur-3xl" aria-hidden="true"></div>

      <h3 class="font-mono text-accent-blue text-xs tracking-[0.3em] uppercase mb-6">Learning Resources</h3>
      <p class="text-white/60 text-sm leading-relaxed mb-8">
        Cryptic hunts revolve around tech, trivia, and anything you can find online. Googling is allowed
        and encouraged, but it won't directly get you the answer. Think logically, connect the dots.
      </p>

      <div class="grid sm:grid-cols-2 gap-4">
        {#each [
          { label: "Hunt's Site",  tip: "Clues hide in rules, descriptions, page titles, and URLs. Every word matters." },
          { label: "Source Code",  tip: "Check code comments and hidden links. Use Inspect Element (Ctrl+Shift+I)." },
          { label: "Audio Files",  tip: "Use spectrograms, Audacity, or Sonic Visualizer. Look for morse code or binary." },
          { label: "Images",       tip: "Check metadata and steganography. Use Aperisolve to extract hidden info." },
          { label: "Backlinks",    tip: "Append random strings to bit.ly, imgur, pastebin, etc. Use a4x.me to identify." },
          { label: "Ciphers",      tip: "Expect Morse, binary, Caesar, Vigenere. Clues are often encoded in these forms." },
        ] as item}
          <div class="border border-white/5 rounded-lg p-4 hover:border-primary/20 transition-colors">
            <span class="font-mono text-primary text-xs tracking-widest uppercase block mb-2">{item.label}</span>
            <p class="text-white/50 text-xs leading-relaxed">{item.tip}</p>
          </div>
        {/each}
      </div>

      <p class="mt-8 font-mono text-primary/60 text-xs tracking-widest text-center">
        // Keep experimenting. Stay creative. All the best. //
      </p>
    </div>

    <!-- Team -->
    <div class="glass-card p-8 relative overflow-hidden reveal-on-scroll">
      <div class="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
      <h3 class="font-mono text-primary text-xs tracking-[0.3em] uppercase mb-6 text-center">The Team</h3>
      <div class="grid grid-cols-1 sm:grid-cols-1 gap-6 justify-items-center">
        {#each [
          
          { name: 'Team Kivy', role: 'Kushwaha Abhay'}

        ] as member}
          <div class="text-center">
            <div class="w-12 h-12 rounded-full border border-primary/30 bg-primary/5 mx-auto mb-3 flex items-center justify-center">
              <span class="font-mono text-primary font-bold">{member.name[0]}</span>
            </div>
            <h4 class="font-display font-bold text-white text-sm">{member.name}</h4>
            <p class="font-mono text-primary/50 text-[10px] tracking-widest uppercase mt-1">{member.role}</p>
          </div>
        {/each}
      </div>
    </div>

  </div>
</main>
