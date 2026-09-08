import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // NairobiX Orange — used selectively as the accent
        primary: {
          DEFAULT: '#F97316',
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
        },
        // Deep, near-black ink used for the dark/cinematic landing surface
        ink: {
          DEFAULT: '#0B0D10',
          950: '#0B0D10',
          900: '#111318',
          800: '#181B21',
          700: '#22262E',
          600: '#2E333D',
          500: '#454C58',
        },
        // Neutral palette
        neutral: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'ui-serif', 'Georgia', 'serif'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1.1' }],
        '6xl': ['3.75rem', { lineHeight: '1.05' }],
      },
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
        '3xl': '4rem',
      },
      boxShadow: {
        xs: '0 1px 2px 0 rgba(15, 15, 15, 0.04)',
        sm: '0 1px 3px 0 rgba(15, 15, 15, 0.06), 0 1px 2px -1px rgba(15, 15, 15, 0.04)',
        base: '0 2px 8px -2px rgba(15, 15, 15, 0.08), 0 1px 2px -1px rgba(15, 15, 15, 0.04)',
        md: '0 8px 20px -6px rgba(15, 15, 15, 0.10), 0 2px 6px -2px rgba(15, 15, 15, 0.05)',
        lg: '0 16px 32px -12px rgba(15, 15, 15, 0.14), 0 4px 8px -2px rgba(15, 15, 15, 0.05)',
        xl: '0 24px 48px -16px rgba(15, 15, 15, 0.18)',
        glow: '0 0 0 1px rgba(249, 115, 22, 0.15), 0 8px 24px -8px rgba(249, 115, 22, 0.35)',
      },
      borderRadius: {
        xs: '0.25rem',
        sm: '0.375rem',
        base: '0.625rem',
        md: '0.875rem',
        lg: '1.25rem',
        xl: '1.75rem',
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in': 'fade-in 0.4s ease-out both',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
