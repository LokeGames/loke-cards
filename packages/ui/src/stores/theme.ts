import { writable } from "svelte/store";
import {
  applyTheme,
  cycleTheme,
  readStoredTheme,
  subscribeToSystemTheme,
  type ThemePreference,
} from "../lib/theme";

const themeStoreInternal = (() => {
  const initial = readStoredTheme();
  const store = writable<ThemePreference>(initial);
  let current = initial;

  store.subscribe((value) => {
    current = value;
    applyTheme(value);
  });

  if (typeof window !== "undefined") {
    applyTheme(initial);
    subscribeToSystemTheme(() => {
      if (current === "system") {
        applyTheme(current);
      }
    });
  }

  return {
    subscribe: store.subscribe,
    set: store.set,
    update: store.update,
    toggle() {
      store.update((value) => cycleTheme(value));
    },
    getCurrent(): ThemePreference {
      return current;
    },
  };
})();

export const themePreference = themeStoreInternal;
