import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}', // shadcn/ui generó aquí
  ],
  theme: {
    extend: {
      colors: {
        carbon: '#0b0b0c',
        gold: '#d4af37',
        grayp: {
          50: '#f6f7f8',
          100: '#eceef0',
          200: '#d4d7db',
          300: '#b7bbc2',
          400: '#8d939d',
          500: '#6f7682',
          600: '#585e68',
          700: '#3f434a',
          800: '#2a2d32',
          900: '#1a1c1f',
        },
      },
      fontFamily: {
        // ejemplo: añade tu var de Montserrat junto a la sans por defecto
        montserrat: ['var(--font-montserrat)', ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        gold: '0 4px 20px rgba(212, 175, 55, 0.15)',
      },
      borderColor: {
        gold: '#d4af37',
      },
      backgroundImage: {
        'carbon-gradient': 'linear-gradient(180deg, #0b0b0c 0%, #121213 100%)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config

