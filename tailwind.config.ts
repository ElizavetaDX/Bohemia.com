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
        beige: {
          50: '#FAF8F5',
          100: '#F5F1EB',
          200: '#E8E4DC',
          300: '#D4CFC4',
          400: '#B8B2A4',
        },
        graphite: {
          400: '#6B6B6B',
          500: '#4A4A4A',
          600: '#3D3D3D',
          700: '#2C2C2C',
          800: '#1F1F1F',
        },
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        'press-start': ['var(--font-press-start-2p)', 'monospace'],
      },
      letterSpacing: {
        wide: '0.2em',
        'wide-lg': '0.35em',
      },
    },
  },
  plugins: [],
}
export default config
