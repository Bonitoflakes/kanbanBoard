const isDarkThemeSet = localStorage.theme === "dark";
const isThemeStored = "theme" in localStorage;
const isDarkPreferred = window.matchMedia(
  "(prefers-color-scheme: dark)",
).matches;

const theme =
  isDarkThemeSet || (!isThemeStored && isDarkPreferred) ? "dark" : "light";

document.documentElement.setAttribute("data-theme", theme);

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (e) => {
    document.documentElement.setAttribute(
      "data-theme",
      e.matches ? "dark" : "light",
    );
  });

