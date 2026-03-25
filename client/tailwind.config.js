import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        auburn: '#A52A2A',
        bronze: {
          light: '#CD9B6A',
          DEFAULT: '#B87333',
          dark: '#8B5E3C',
        },
        ash: {
          light: '#2C2C2C',
          DEFAULT: '#1A1A1A',
          dark: '#121212',
        }
      },
      fontFamily: {
        brent: ['BRENTON', 'sans-serif'],
        glass: ['Glass Antiqua', 'cursive'],
        wellston: ['Wellston', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-ash': 'linear-gradient(to bottom, #2C2C2C, #1A1A1A)',
        'gradient-dark': 'linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.95))',
        'gradient-ft-bg': 'linear-gradient(to bottom, rgba(165,42,42,0.1), rgba(0,0,0,0.95))',
      },
      perspective: {
        '1000': '1000px',
      },
    },
  },
  plugins: [],
}