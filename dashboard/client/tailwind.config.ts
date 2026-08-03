import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Mismo lenguaje de marca que BEEPYRED---DASHBOARD
        brand: {
          DEFAULT: '#F5A800',
          hover: '#D98F00',
        },
        page: '#0A0A0A',
        surface: '#18181B',
        surface2: '#1C1C1F',
        border: '#27272A',
        text: {
          primary: '#FFFFFF',
          secondary: '#A1A1AA',
          muted: '#71717A',
        },
        error: '#EF4444',
      },
    },
  },
  plugins: [],
}

export default config
