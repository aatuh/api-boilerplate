import { enUS, fiFI } from "@clerk/localizations";

export type ClerkLocalization = typeof enUS;

type LocalizationMap = Record<string, ClerkLocalization>;

const defaultLocalizationMap: LocalizationMap = {
  en: enUS,
  fi: fiFI,
};

let localizationMap: LocalizationMap = { ...defaultLocalizationMap };

export function configureClerkLocalizations(overrides: LocalizationMap) {
  localizationMap = { ...defaultLocalizationMap, ...overrides };
}

export function resolveClerkLocalization(locale?: string | null): ClerkLocalization {
  const normalized = (locale ?? "").trim().toLowerCase();
  if (!normalized) return enUS;
  const match = Object.keys(localizationMap).find(
    (key) => normalized === key || normalized.startsWith(`${key}-`)
  );
  if (match) return localizationMap[match];
  if (process.env.NODE_ENV !== "production") {
    console.warn(`[auth-clerk] No localization for locale "${locale}". Falling back to English.`);
  }
  return enUS;
}
