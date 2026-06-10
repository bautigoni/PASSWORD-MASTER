/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0b1020',
        panel: '#11183a',
        panel2: '#1a2350',
        accent: '#7c5cff',
        accent2: '#22d3ee',
        success: '#22c55e',
        danger: '#ef4444',
        warning: '#f59e0b',
        text: '#e6e9ff',
        muted: '#8b91c5',
      },
      fontFamily: {
        display: ['"Fredoka"', '"Inter"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 24px rgba(124,92,255,0.45), 0 0 48px rgba(34,211,238,0.25)',
        soft: '0 8px 24px rgba(0,0,0,0.35)',
      },
      keyframes: {
        floaty: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        wiggle: {
          '0%,100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
        pulseGlow: {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(124,92,255,0.7)' },
          '50%': { boxShadow: '0 0 0 12px rgba(124,92,255,0)' },
        },
      },
      animation: {
        floaty: 'floaty 3s ease-in-out infinite',
        wiggle: 'wiggle 0.4s ease-in-out',
        pulseGlow: 'pulseGlow 1.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
