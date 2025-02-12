module.exports = {
  darkMod: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      sm: "375px",
      md: "540px",
      lg: "1024px",
    },
    extend: {
      fontFamily: {
        sans: ["JetBrains Mono", "sans-serif"],
      },
      fontSize: {
        "2xs": "0.625rem",
        "3xs": "0.5rem",
        "4xs": "0.375rem",
      },
      maxWidth: {
        "2xs": "16rem",
        "3xs": "12rem",
        "4xs": "8rem",
      },
      textShadow: {
        "thin-black": "3px 3px 5px black",
      },
    },
  },
  plugins: [require("tailwindcss-textshadow")],
};
