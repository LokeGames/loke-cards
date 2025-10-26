export type ThemePreference = "light" | "dark" | "system";

const STORAGE_KEY = "theme";

export function readStoredTheme(): ThemePreference {
  if (typeof window === "undefined") {
    return "system";
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark" || stored === "system") {
    return stored;
  }
  return "system";
}

export function resolveEffectiveTheme(theme: ThemePreference): "light" | "dark" {
  if (theme === "system" && typeof window !== "undefined") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return theme === "dark" ? "dark" : "light";
}

export function applyTheme(theme: ThemePreference): void {
  if (typeof document === "undefined") {
    return;
  }

  const effectiveTheme = resolveEffectiveTheme(theme);
  document.documentElement.classList.toggle("dark", effectiveTheme === "dark");

  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Ignore storage write errors (private browsing, etc.)
  }
}

export function cycleTheme(current: ThemePreference): ThemePreference {
  const modes: ThemePreference[] = ["light", "dark", "system"];
  const index = modes.indexOf(current);
  const nextIndex = (index + 1) % modes.length;
  return modes[nextIndex];
}

export function subscribeToSystemTheme(onChange: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  const handler = () => onChange();

  mediaQuery.addEventListener("change", handler);

  return () => {
    mediaQuery.removeEventListener("change", handler);
  };
}
