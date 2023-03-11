/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#355170",
        secondary: "#EE2650",
      },

      width: {
        860: "860px",
      },
      minWidth: {
        860: "860px",
      },
      height: {
        special: "calc(100vh - 300px)",
      },
    },
  },

  plugins: [],
};
