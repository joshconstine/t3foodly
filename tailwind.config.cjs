/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#355170",

          secondary: "#EE2650",

          accent: "#fc9d20",

          neutral: "#2b2c36",

          "base-100": "#ffffff",

          info: "#759af0",

          success: "#116f61",

          warning: "#a26011",

          error: "#f5424b",
        },
      },
    ],
  },
  theme: {
    extend: {
      colors: {
        primary: "#355170",
        secondary: "#EE2650",
      },

      width: {
        860: "860px",
        650: "650px",
        450: "450px",
      },
      minWidth: {
        860: "860px",
        650: "650px",
      },
      height: {
        special: "calc(100vh - 300px)",
      },
    },
  },

  plugins: [require("daisyui")],
};
