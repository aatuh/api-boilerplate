"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  DEFAULT_THEME_VARIANT,
  DEFAULT_THEME_VARIANTS,
  type ThemeVariant,
  type ThemeVariantName,
} from "./variants";

type ThemeVariantContextValue = {
  variant: ThemeVariantName;
  setVariant: (variant: ThemeVariantName) => void;
  variants: ThemeVariant[];
};

const ThemeVariantContext = createContext<ThemeVariantContextValue>({
  variant: DEFAULT_THEME_VARIANT,
  setVariant: () => {},
  variants: DEFAULT_THEME_VARIANTS,
});

const DEFAULT_STORAGE_KEY = "cx-theme-variant";

function applyVariant(next: ThemeVariantName) {
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-theme-variant", next);
  }
}

function normalizeVariants(variants?: ThemeVariant[]) {
  const fallback = DEFAULT_THEME_VARIANTS;
  const resolved = variants && variants.length > 0 ? variants : fallback;
  return resolved.length > 0 ? resolved : fallback;
}

function resolveDefaultVariant(variants: ThemeVariant[], defaultVariant?: ThemeVariantName) {
  const allowed = new Set(variants.map((opt) => opt.name));
  if (defaultVariant && allowed.has(defaultVariant)) return defaultVariant;
  return variants[0]?.name ?? DEFAULT_THEME_VARIANT;
}

export function ThemeVariantProvider({
  children,
  defaultVariant = DEFAULT_THEME_VARIANT,
  storageKey = DEFAULT_STORAGE_KEY,
  variants,
}: {
  children: ReactNode;
  defaultVariant?: ThemeVariantName;
  storageKey?: string;
  variants?: ThemeVariant[];
}) {
  const resolvedStorageKey = storageKey || DEFAULT_STORAGE_KEY;
  const resolvedVariants = useMemo(() => normalizeVariants(variants), [variants]);
  const resolvedDefault = useMemo(
    () => resolveDefaultVariant(resolvedVariants, defaultVariant),
    [defaultVariant, resolvedVariants]
  );
  const allowedVariants = useMemo(
    () => new Set(resolvedVariants.map((opt) => opt.name)),
    [resolvedVariants]
  );
  const [variant, setVariantState] = useState<ThemeVariantName>(() => {
    if (typeof document === "undefined") return resolvedDefault;
    try {
      const stored = localStorage.getItem(resolvedStorageKey);
      if (stored && allowedVariants.has(stored)) {
        return stored;
      }
    } catch {
      // ignore
    }
    return resolvedDefault;
  });

  const setVariant = useCallback(
    (next: ThemeVariantName) => {
      if (!allowedVariants.has(next)) {
        setVariantState(resolvedDefault);
        return;
      }
      setVariantState(next);
    },
    [allowedVariants, resolvedDefault]
  );

  useEffect(() => {
    applyVariant(variant);
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(resolvedStorageKey, variant);
    }
  }, [variant, resolvedStorageKey]);

  const value = useMemo(
    () => ({ variant, setVariant, variants: resolvedVariants }),
    [resolvedVariants, setVariant, variant]
  );

  return <ThemeVariantContext.Provider value={value}>{children}</ThemeVariantContext.Provider>;
}

export function useThemeVariant() {
  return useContext(ThemeVariantContext);
}
