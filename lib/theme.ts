export type Theme = "light" | "dark";

const storageKey = "superzyk-theme";

export function readStoredTheme(): Theme {
  try {
    const storedTheme = window.localStorage.getItem(storageKey);
    return storedTheme === "light" || storedTheme === "dark" ? storedTheme : "dark";
  } catch {
    // Storage can be unavailable even when the browser allows theme changes.
    return "dark";
  }
}

export function saveTheme(theme: Theme): void {
  try {
    window.localStorage.setItem(storageKey, theme);
  } catch {
    // Keep the current theme usable when the preference cannot be persisted.
  }
}
