import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7f0',
          100: '#fdeee0',
          200: '#fbdac1',
          300: '#f8be98',
          400: '#f4996d',
          500: '#f07544',
          600: '#e15a2a',
          700: '#ba4620',
          800: '#983a1f',
          900: '#7a331c',
          DEFAULT: '#663399', // viola principale
        },
        accent: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          DEFAULT: '#663399', // viola ceramico
        },
        ceramic: {
          white: '#faf9f7', // Bianco porcellana
          terracotta: '#e15a2a',
          beige: '#e8e3d8',
          sand: '#d4c5b0',
          earth: '#8b7355',
          clay: '#a67c52',
        },
      },
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'DM Sans', 'system-ui', 'sans-serif'],
        serif: ['var(--font-fraunces)', 'Fraunces', 'Georgia', 'serif'],
      },
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',
        DEFAULT: '0.5rem',
        'md': '0.75rem',
        'lg': '1rem',
        'xl': '1.5rem',
        '2xl': '2rem',
        'artistic': '0.75rem',
        'full': '9999px',
      },
    },
  },
  plugins: [],
}
export default config
