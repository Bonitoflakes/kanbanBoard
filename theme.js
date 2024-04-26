const isDarkThemeSet = localStorage.theme === "dark";
const isThemeStored = "theme" in localStorage;
const isDarkPreferred = window.matchMedia(
  "(prefers-color-scheme: dark)",
).matches;

const theme =
  isDarkThemeSet || (!isThemeStored && isDarkPreferred) ? "dark" : "light";

document.documentElement.setAttribute("data-theme", theme);

if (theme === "dark") {
  document.documentElement.classList.add("dark");
}

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (e) => {
    document.documentElement.setAttribute(
      "data-theme",
      e.matches ? "dark" : "light",
    );

    if (e.matches) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  });
