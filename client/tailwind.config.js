/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      width: {
        1000: "1000px",
        20: "20%",
        100: "100px",
        50: "50px",
      },
      height: {
        100: "100px",
        300: "300px",
        50: "50px",
      },
      minHeight: {
        95: "95vh",
      },
      padding: {
        100: "86px",
      },
      colors: {
        secondary: "#023047",
        primary: "#219ebc",
        secondary_linear: "#22195f",
        gray1: "#d3d3d34c",
        lightgray: "#d3d3d3",
        gray2: "#d3d3d311",
        primary_color: "#219ebc",
        g_2e8b5693: "#2e8b5693",
        g_2e8b56f9: "#2e8b56f9",
        b_6494ed86: "#6494ed86",
        b_226df9f9: "#226df9f9",
        v_da70d6: "#da70d6",
        v_40013e: "#40013e",
        br_f4a460: "#f4a460",
        br_c05a02: "#c05a02",
        black_opacity: "#494848",
      },
      fontSize: {
        100: "100px",
      },
    },
  },
  plugins: [],
};
