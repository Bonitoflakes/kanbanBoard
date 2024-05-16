/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: ["selector"],
  theme: {
    extend: {
      colors: {
        primary: "hsl(var(--primary)/ <alpha-value>)",
        secondary: "hsl(var(--secondary)/ <alpha-value>)",
        tertiary: "hsl(var(--tertiary)/ <alpha-value>)",
        "accent-1": "hsl(var(--accent-1)/ <alpha-value>)",
        "accent-2": "hsl(var(--accent-2)/ <alpha-value>)",
        "accent-3": "hsl(var(--accent-3)/ <alpha-value>)",
      },
      boxShadow: {},
      keyframes: {},
      animation: {},
    },
  },
  plugins: [],
};
