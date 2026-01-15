import { countries } from "./data/countries";
import { fiCountryNames } from "./country-names/fi";

const countryMap: Record<string, string> = {};
for (const country of countries) {
  countryMap[country.code] = country.name;
}

export function getCountryName(code: string, locale: string): string {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return "";
  const baseLocale = locale.trim().toLowerCase().split("-")[0];
  if (baseLocale === "fi") {
    return fiCountryNames[normalized] || normalized;
  }
  try {
    if (typeof Intl !== "undefined" && typeof Intl.DisplayNames !== "undefined") {
      const display = new Intl.DisplayNames([locale, "en"], { type: "region" });
      const name = display.of(normalized);
      if (name && name.toUpperCase() !== normalized) {
        return name;
      }
    }
  } catch {
    // ignore Intl errors and fallback
  }
  return countryMap[normalized] || normalized;
}
