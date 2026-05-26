import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#0a0a0f',
          surface: '#12121a',
          border: '#1a1a2e',
          cyan: '#00f5ff',
          pink: '#ff2d7b',
          yellow: '#f5ff00',
          purple: '#b829dd',
          text: '#e0e0e8',
          muted: '#6b6b80',
        },
      },
      fontFamily: {
        heading: ['Orbitron', 'sans-serif'],
        jp: ['"Noto Sans JP"', 'sans-serif'],
        body: ['"Chakra Petch"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite alternate',
        'border-rotate': 'border-rotate 4s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%': { opacity: '0.6' },
          '100%': { opacity: '1' },
        },
        'border-rotate': {
          to: { '--angle': '360deg' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
