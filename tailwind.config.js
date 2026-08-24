/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        vybe: {
          bg: "#f5f7ff",
          card: "#ffffff",
          border: "#c9d6ff",
          purple: "#4c6fff",
          pink: "#ff6b6b",
          cyan: "#2ec4b6",
          text: "#20232b",
          muted: "#6b7280",
        },
      },
      backgroundImage: {
        "vybe-gradient": "linear-gradient(135deg, #4c6fff 0%, #2ec4b6 100%)",
      },
    },
  },
  plugins: [],
};