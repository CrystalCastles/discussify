/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        spotifyGreen: "#1DB954",
        spotifyBlack: "#242424",
        mainBlack: "#121212",
      },
      visibility: ["group-hover"],
    },
    screens: {
      xs: "0px",

      "2sm": "520px",

      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      customMd: "870px",

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }

      "3xl": "2220px",
      // => @media (min-width: 1536px) { ... }
    },
  },
  plugins: [
    require("prettier-plugin-tailwindcss"),
    require("flowbite/plugin"),
    require("tailwind-scrollbar"),
    require('@tailwindcss/line-clamp'),
  ],
};
