/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        spotifyGreen: '#1DB954',
        spotifyBlack: '#191414'
      }
    },
  },
  plugins: [require('prettier-plugin-tailwindcss')],
}
