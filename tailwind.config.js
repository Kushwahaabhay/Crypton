/** @type {import('tailwindcss').Config} */
import flattenColorPalette from 'tailwindcss/lib/util/flattenColorPalette';
import aspectRatio from '@tailwindcss/aspect-ratio';
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        primary: '#13ec49',
        'primary-dim': '#008f11',
        'bg-dark': '#050505',
        'error': '#FF003C',
        'accent-purple': '#9D4EDD',
        'accent-blue': '#48CAE4',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      keyframes: {
        'glitch-1': {
          '0%':   { clipPath: 'inset(20% 0 80% 0)' },
          '20%':  { clipPath: 'inset(60% 0 10% 0)' },
          '40%':  { clipPath: 'inset(40% 0 50% 0)' },
          '60%':  { clipPath: 'inset(80% 0 5% 0)'  },
          '80%':  { clipPath: 'inset(10% 0 70% 0)' },
          '100%': { clipPath: 'inset(30% 0 20% 0)' },
        },
        'glitch-2': {
          '0%':   { clipPath: 'inset(50% 0 30% 0)' },
          '20%':  { clipPath: 'inset(10% 0 60% 0)' },
          '40%':  { clipPath: 'inset(70% 0 20% 0)' },
          '60%':  { clipPath: 'inset(30% 0 50% 0)' },
          '80%':  { clipPath: 'inset(5% 0 80% 0)'  },
          '100%': { clipPath: 'inset(60% 0 10% 0)' },
        },
        scanline: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%':      { transform: 'translateY(-10px) rotate(1deg)' },
          '66%':      { transform: 'translateY(-5px) rotate(-1deg)' },
        },
        'fade-in-up': {
          '0%':   { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-down': {
          '0%':   { opacity: '0', transform: 'translateY(-100%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.8' },
        },
      },
      animation: {
        'glitch-1':   'glitch-1 2.5s infinite linear alternate-reverse',
        'glitch-2':   'glitch-2 3s infinite linear alternate-reverse',
        scanline:     'scanline 8s linear infinite',
        float:        'float 30s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.8s ease forwards',
        'slide-down': 'slide-down 0.4s ease forwards',
        flicker:      'flicker 3s ease-in-out infinite',
      },
    },
  },
  plugins: [require('daisyui'), aspectRatio, addVariablesForColors],
  daisyui: {
    themes: [{
      crypton: {
        ...require("daisyui/src/theming/themes")["night"],
        "base-100": "#050505",
        "primary": "#13ec49",
      }
    }],
  }
}

function addVariablesForColors({ addBase, theme }) {
  let allColors = flattenColorPalette(theme('colors'));
  let newVars = Object.fromEntries(
      Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );
  addBase({ ':root': newVars });
}