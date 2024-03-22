/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: ["absolute", "right-0", "top-0", "z-40"],
  theme: {
    screens: {
      ssm: "480px",
      // => @media (min-width: 480px) { ... }

      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }
      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }
    },
    container: {
      padding: "1em",
      center: true,
      screens: {
        "2xl": "1392px",
      },
    },
    extend: {
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
        elle: ["ElleFutura", "sans-serif"],
      },
      colors: {
        red: "#FF0000",
        primry:"#000000",
        black: "#000000",
        gray: "#D1CFCF",
        white: "#ffffff",
        pink: "#f4f4f4",
      }
    },
  },
  plugins: [],
};
