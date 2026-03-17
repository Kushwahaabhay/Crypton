<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  let canvas: HTMLCanvasElement;
  let animId: number;

  onMount(() => {
    if (!browser) return;

    const ctx = canvas.getContext('2d')!;
    let cols: number[] = [];

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const count = Math.floor(canvas.width / 16);
      cols = Array.from({ length: count }, () => Math.random() * canvas.height);
    }

    resize();
    window.addEventListener('resize', resize);

    function draw() {
      ctx.fillStyle = 'rgba(5,5,5,0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#13ec49';
      ctx.font = '16px "Space Mono", monospace';

      cols.forEach((y, i) => {
        const char = Math.random() > 0.5 ? '1' : '0';
        ctx.fillText(char, i * 16, y);
        if (y > canvas.height && Math.random() > 0.975) {
          cols[i] = 0;
        } else {
          cols[i] = y + 16;
        }
      });

      animId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  });
</script>

<canvas
  bind:this={canvas}
  class="fixed inset-0 z-0 opacity-30 pointer-events-none"
/>
