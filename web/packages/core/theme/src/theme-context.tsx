"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  setTheme: () => {},
  toggle: () => {},
});

export const THEME_STORAGE_KEY = "cx-theme";
export const CONSENT_STORAGE_KEY = "cx-cookie-consent";
const PREFERENCE_KEY = "preferences:ui-preferences";
const CONSENT_EVENT = "cx:consent-updated";

const systemPrefersDark = () => {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
};

const resolveTheme = (theme: Theme): ResolvedTheme => {
  if (theme === "system") {
    return systemPrefersDark() ? "dark" : "light";
  }
  return theme;
};

function applyTheme(next: Theme) {
  if (typeof document !== "undefined") {
    const resolved = resolveTheme(next);
    document.documentElement.setAttribute("data-theme", resolved);
    document.documentElement.style.colorScheme = resolved;
  }
}

function readPreferenceConsent(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as { preferences?: Record<string, boolean> };
    const prefs = parsed?.preferences;
    if (!prefs) return false;
    const value = prefs[PREFERENCE_KEY];
    return value === true;
  } catch {
    return false;
  }
}

type ThemeProviderProps = {
  children: ReactNode;
  storageKey?: string;
};

export function ThemeProvider({
  children,
  storageKey = THEME_STORAGE_KEY,
}: ThemeProviderProps) {
  const [canPersist, setCanPersist] = useState<boolean>(() =>
    readPreferenceConsent()
  );
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof document === "undefined") return "system";
    const allowed = readPreferenceConsent();
    if (!allowed) return "system";
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored === "light" || stored === "dark" || stored === "system") {
        return stored;
      }
    } catch {
      // ignore
    }
    return "system";
  });

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
  }, []);

  // Apply theme and persist.
  useEffect(() => {
    applyTheme(theme);
    if (typeof localStorage !== "undefined") {
      if (canPersist) {
        localStorage.setItem(storageKey, theme);
      } else {
        localStorage.removeItem(storageKey);
      }
    }
    if (typeof document !== "undefined") {
      const secure = window.location.protocol === "https:" ? "; Secure" : "";
      if (canPersist) {
        document.cookie = `${storageKey}=${encodeURIComponent(
          theme
        )}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`;
      } else {
        document.cookie = `${storageKey}=; Path=/; Max-Age=0; SameSite=Lax${secure}`;
      }
    }
  }, [canPersist, storageKey, theme]);

  // Listen to system changes only if user hasn't chosen explicitly.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = () => {
      const stored =
        typeof localStorage !== "undefined"
          ? localStorage.getItem(storageKey)
          : null;
      if (stored === "system" || !stored) {
        applyTheme("system");
        setThemeState("system");
      }
    };
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [storageKey]);

  // Listen for consent changes via storage events.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = () => {
      const allowed = readPreferenceConsent();
      setCanPersist(allowed);
      if (!allowed) {
        setThemeState("system");
        if (typeof localStorage !== "undefined") {
          localStorage.removeItem(storageKey);
        }
      }
    };
    window.addEventListener("storage", handler);
    window.addEventListener(CONSENT_EVENT, handler);
    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener(CONSENT_EVENT, handler);
    };
  }, [storageKey, setTheme]);

  const toggle = useCallback(() => {
    const order: Theme[] = ["system", "light", "dark"];
    const next = order[(order.indexOf(theme) + 1) % order.length];
    setTheme(next);
  }, [theme, setTheme]);

  const value = useMemo(
    () => ({ theme, setTheme, toggle }),
    [theme, setTheme, toggle]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useThemeMode() {
  return useContext(ThemeContext);
}

export function useResolvedTheme(): ResolvedTheme {
  const { theme } = useContext(ThemeContext);
  const [resolved, setResolved] = useState<ResolvedTheme>(() =>
    resolveTheme(theme)
  );

  useEffect(() => {
    setResolved(resolveTheme(theme));
  }, [theme]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (theme !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = () => setResolved(resolveTheme("system"));
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [theme]);

  return resolved;
}
