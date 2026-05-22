/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-pink': '#FF1493',
        'soft-pink': '#FFB6C1',
        'deep-purple': '#9D4EDD',
        'red-accent': '#E63946',
        'dark-bg': '#0a0a0a',
        'card-white': '#FAFAFA',
        'gold-glow': '#FFD700',
        'orange-glow': '#FF8C00',
        'night-sky': '#0d0221',
      },
      fontFamily: {
        'great-vibes': ['"Great Vibes"', 'cursive'],
        'dancing': ['"Dancing Script"', 'cursive'],
        'special-elite': ['"Special Elite"', 'cursive'],
        'courier-prime': ['"Courier Prime"', 'monospace'],
        'orbitron': ['Orbitron', 'monospace'],
        'share-tech': ['"Share Tech Mono"', 'monospace'],
        'caveat': ['Caveat', 'cursive'],
        'inter': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

