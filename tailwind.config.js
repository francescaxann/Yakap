/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: { desktop: '801px' },
      keyframes: {
        'bot-bounce': {
          '0%, 100%': { transform: 'translateY(0) rotate(0)' },
          '40%': { transform: 'translateY(-30px) rotate(-4deg)' },
          '70%': { transform: 'translateY(3px) rotate(3deg)' },
        },
        'cookie-pop': {
          '45%': { transform: 'translateY(-18px) rotate(-12deg) scale(1.12)' },
          '100%': { transform: 'rotate(-4deg)' },
        },
        twinkle: { '50%': { transform: 'translateY(-5px) rotate(12deg) scale(1.12)' } },
      },
      animation: {
        'bot-bounce': 'bot-bounce .7s ease-in-out 2',
        'cookie-pop': 'cookie-pop .55s ease-out',
        twinkle: 'twinkle 1.8s ease-in-out .6s 2',
      },
      colors: {
        background: 'rgb(var(--background) / <alpha-value>)',
        foreground: 'rgb(var(--foreground) / <alpha-value>)',
        border: 'rgb(var(--border) / <alpha-value>)',
        link: 'rgb(var(--link) / <alpha-value>)',
        ink: { DEFAULT: '#21475b', border: '#85abba', muted: '#bedce7', accent: '#9bd4e4', success: '#9fe2d7' },
        input: 'rgb(var(--input) / <alpha-value>)',
        ring: 'rgb(var(--ring) / <alpha-value>)',
        primary: { DEFAULT: 'rgb(var(--primary) / <alpha-value>)', foreground: 'rgb(var(--foreground) / <alpha-value>)' },
        secondary: { DEFAULT: 'rgb(var(--secondary) / <alpha-value>)', foreground: 'rgb(var(--foreground) / <alpha-value>)' },
        accent: { DEFAULT: 'rgb(var(--muted) / <alpha-value>)', foreground: 'rgb(var(--foreground) / <alpha-value>)' },
        muted: { DEFAULT: 'rgb(var(--muted) / <alpha-value>)', foreground: 'rgb(var(--muted-foreground) / <alpha-value>)' },
        destructive: { DEFAULT: 'rgb(var(--destructive) / <alpha-value>)', foreground: 'rgb(var(--destructive-foreground) / <alpha-value>)' },
      },
      fontFamily: { sans: ['Manrope Variable', 'sans-serif'], mono: ['DM Mono', 'monospace'] },
    },
  },
  plugins: [],
}

