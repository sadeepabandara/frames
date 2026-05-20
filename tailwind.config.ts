import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './providers/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        background: '#0a0a0a',
        surface:    '#111111',
        'surface-2':'#181818',
        'surface-3':'#222222',
        foreground:  '#f5f5f5',
        muted:       '#a0a0a0',
        faint:       '#606060',
        accent:      '#3b82f6',
        'accent-hover': '#2563eb',
        border:      'rgba(255,255,255,0.06)',
        'border-2':  'rgba(255,255,255,0.12)',
        green:       '#4ade80',
        red:         '#f87171',
        blue:        '#60a5fa',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease both',
        'fade-in': 'fadeIn 0.4s ease both',
        shimmer:   'shimmer 1.6s infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
      maxWidth: {
        '125': '31.25rem',
        '135': '33.75rem',
      },
      minHeight: {
        '140': '35rem',
      },
      maxHeight: {
        '225': '56.25rem',
      },
      spacing: {
        '0.75': '0.1875rem',
      },
    },
  },
  plugins: [],
};

export default config;
