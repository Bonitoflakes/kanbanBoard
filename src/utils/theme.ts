/**
 * Toggles the theme based on the specified mode.
 * @param {("system" | "light" | "dark")} mode - The mode to toggle the theme to.
 * @returns {void}
 */
const toggleTheme = (mode: "system" | "light" | "dark"): void => {
  const isDarkPreferred = window.matchMedia(
    "(prefers-color-scheme: dark)",
  ).matches;
  const theme = mode === "system" ? (isDarkPreferred ? "dark" : "light") : mode;
  mode !== "system" && localStorage.setItem("theme", theme);
  mode === "system" && localStorage.removeItem("theme");
  document.documentElement.setAttribute("data-theme", theme);

  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};

export { toggleTheme };
