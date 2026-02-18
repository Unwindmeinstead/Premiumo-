import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0a0a0a',
          surface: '#0f0f0f',
          card: '#0d0d0d',
          border: '#1a1a1a',
          text: '#e5e5e5',
          muted: '#a0a0a0',
        },
      },
    },
  },
  plugins: [],
}
export default config
