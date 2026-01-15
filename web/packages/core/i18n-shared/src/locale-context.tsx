"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { DEFAULT_LOCALE, type Locale } from "./config";

export type Translator = (key: string, params?: Record<string, string | number>) => string;
export type RawTranslator = (key: string, params?: Record<string, string | number>) => unknown;

type DictionaryShape = Record<string, unknown>;

type LocaleContextValue = {
  locale: Locale;
  t: Translator;
  tRaw: RawTranslator;
};

const LocaleContext = createContext<LocaleContextValue>({
  locale: DEFAULT_LOCALE,
  t: (key) => key,
  tRaw: (key) => key,
});

function lookupValue(dictionary: DictionaryShape, key: string): unknown {
  const parts = key.split(".");
  let current: unknown = dictionary;
  for (const part of parts) {
    if (Array.isArray(current)) {
      const idx = Number(part);
      if (Number.isNaN(idx) || idx < 0 || idx >= current.length) return undefined;
      current = current[idx];
      continue;
    }
    if (!isRecord(current)) return undefined;
    current = current[part];
    if (current === undefined || current === null) return undefined;
  }
  return current;
}

function lookupString(dictionary: DictionaryShape, key: string): string | undefined {
  const value = lookupValue(dictionary, key);
  if (typeof value === "string") return value;
  return undefined;
}

function interpolate(input: string, params?: Record<string, string | number>) {
  if (!params) return input;
  return input.replace(/\{(\w+)\}/g, (_, name) => (params[name] ?? `{${name}}`).toString());
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function createLocaleProvider(getDictionary: (locale: Locale) => DictionaryShape) {
  return function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
    const dictionary = useMemo(() => getDictionary(locale), [locale]);
    const t = useMemo<Translator>(() => {
      const fallback = getDictionary(DEFAULT_LOCALE);
      return (key: string, params?: Record<string, string | number>) => {
        const value = lookupString(dictionary, key);
        const resolved = value ?? lookupString(fallback, key) ?? key;
        const text = resolved || key;
        return interpolate(text, params);
      };
    }, [dictionary]);
    const tRaw = useMemo<RawTranslator>(() => {
      const fallback = getDictionary(DEFAULT_LOCALE);
      return (key: string, params?: Record<string, string | number>) => {
        const value = lookupValue(dictionary, key);
        const resolved = value ?? lookupValue(fallback, key);
        if (typeof resolved === "string") {
          const text = resolved || key;
          return interpolate(text, params);
        }
        return resolved ?? key;
      };
    }, [dictionary]);

    return <LocaleContext.Provider value={{ locale, t, tRaw }}>{children}</LocaleContext.Provider>;
  };
}

export function useLocale() {
  return useContext(LocaleContext);
}
