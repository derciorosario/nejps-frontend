/** @type {import('tailwindcss').Config} */
const colors = require('./src/assets/colors.json');
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
     colors: {
        fire_engine_red:colors.fire_engine_red,
        egyptian_blue:colors.egyptian_blue,
        gunmetal:colors.gunmetal,
        verdigris:colors.verdigris,
        light_red:colors.light_red,
        honolulu_blue:colors.honolulu_blue,
        delft_blue:colors.delft_blue,
        common:colors.common
      }
    },
  },
  plugins: [],
}

