import type { Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}', // añade esta línea
  ],
  theme: {
    extend: {
      colors: {
        carbon: '#0b0b0c',
        gold: '#d4af37',
      },
      fontFamily: {
        montserrat: ['var(--font-montserrat)', ...fontFamily.sans],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
