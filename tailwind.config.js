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
      boxShadow: {
        primary:
          "0px 0px 0px 1px rgba(15, 15, 15, 0.04), 0px 3px 6px rgba(15, 15, 15, 0.03), 0px 9px 24px rgba(15, 15, 15, 0.06)",
      },
      keyframes: {
        slideInRight: {
          "0%": { translate: "100%" },
          "100%": { translate: "0%" },
        },
      },
      animation: {
        slideInRight: "slideInRight 1s ease-in-out",
      },
    },
  },
  plugins: [],
};
