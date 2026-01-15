export const FALLBACK_SUPPORTED_LOCALES = ["en", "fi"] as const;
export type Locale = string;
export type FallbackLocale = typeof FALLBACK_SUPPORTED_LOCALES[number];
export const FALLBACK_LOCALE: FallbackLocale = "en";
const TRUE_VALUES = new Set(["1", "true", "yes", "on"]);

function normalizeLocaleCode(input: string): string {
  return input.trim().toLowerCase();
}

function parseBooleanEnv(input: string | undefined, fallback: boolean): boolean {
  if (input === undefined || input === null) return fallback;
  const normalized = input.trim().toLowerCase();
  if (!normalized) return fallback;
  return TRUE_VALUES.has(normalized);
}

export function parseSupportedLocales(input?: string | null): string[] {
  if (!input) return [...FALLBACK_SUPPORTED_LOCALES];
  const parsed = input
    .split(",")
    .map((value) => normalizeLocaleCode(value))
    .filter(Boolean);
  const unique = Array.from(new Set(parsed));
  return unique.length > 0 ? unique : [...FALLBACK_SUPPORTED_LOCALES];
}

function resolveLocaleFromList(
  input: string | null | undefined,
  fallback: Locale,
  supportedLocales: readonly string[]
): Locale {
  const resolvedFallback = normalizeLocaleCode(fallback);
  if (!input) return resolvedFallback;
  const lower = normalizeLocaleCode(input);
  if (!lower) return resolvedFallback;
  const match = supportedLocales.find((loc) => loc === lower || lower.startsWith(`${loc}-`));
  return match ?? resolvedFallback;
}

function ensureSupportedLocales(locales: string[], requiredLocale: Locale): string[] {
  if (locales.includes(requiredLocale)) return locales;
  if (process.env.NODE_ENV !== "production") {
    console.warn(
      `[i18n] Adding default locale "${requiredLocale}" to supported locales because it was missing.`
    );
  }
  return [...locales, requiredLocale];
}

const ENV_SUPPORTED_LOCALES = parseSupportedLocales(process.env.NEXT_PUBLIC_SUPPORTED_LOCALES);
const ENV_DEFAULT_LOCALE = process.env.NEXT_PUBLIC_DEFAULT_LOCALE;
const ENV_LOCALE_AUTO_DETECT = process.env.NEXT_PUBLIC_LOCALE_AUTO_DETECT;

export const DEFAULT_LOCALE: Locale = resolveLocaleFromList(
  ENV_DEFAULT_LOCALE,
  FALLBACK_LOCALE,
  ENV_SUPPORTED_LOCALES
);

export const SUPPORTED_LOCALES = ensureSupportedLocales(ENV_SUPPORTED_LOCALES, DEFAULT_LOCALE);
export const LOCALE_AUTO_DETECT = parseBooleanEnv(ENV_LOCALE_AUTO_DETECT, true);

if (process.env.NODE_ENV !== "production" && ENV_DEFAULT_LOCALE) {
  const normalizedDefault = normalizeLocaleCode(ENV_DEFAULT_LOCALE);
  const hasMatch = ENV_SUPPORTED_LOCALES.some(
    (loc) => loc === normalizedDefault || normalizedDefault.startsWith(`${loc}-`)
  );
  if (!hasMatch) {
    console.warn(
      `[i18n] Default locale "${ENV_DEFAULT_LOCALE}" is not in supported locales (${ENV_SUPPORTED_LOCALES.join(
        ", "
      )}). Falling back to "${DEFAULT_LOCALE}".`
    );
  }
}

export function resolveLocale(
  input?: string | null,
  fallback: Locale = FALLBACK_LOCALE,
  supportedLocales: readonly string[] = SUPPORTED_LOCALES
): Locale {
  return resolveLocaleFromList(input, fallback, supportedLocales);
}

export function parseAcceptLanguage(input?: string | null): string[] {
  if (!input) return [];
  return input
    .split(",")
    .map((part) => {
      const [tagPart, ...params] = part.trim().split(";").filter(Boolean);
      if (!tagPart) return null;
      let quality = 1;
      for (const param of params) {
        const [key, value] = param.trim().split("=");
        if (key === "q") {
          const parsed = Number.parseFloat(value);
          if (!Number.isNaN(parsed)) {
            quality = parsed;
          }
        }
      }
      return { tag: normalizeLocaleCode(tagPart), quality };
    })
    .filter((entry): entry is { tag: string; quality: number } => Boolean(entry))
    .sort((a, b) => b.quality - a.quality)
    .map((entry) => entry.tag);
}

export function resolveLocaleFromAcceptLanguage(
  input?: string | null,
  fallback: Locale = FALLBACK_LOCALE,
  supportedLocales: readonly string[] = SUPPORTED_LOCALES
): Locale {
  try {
    const candidates = parseAcceptLanguage(input);
    for (const candidate of candidates) {
      const match = supportedLocales.find(
        (loc) => loc === candidate || candidate.startsWith(`${loc}-`)
      );
      if (match) return match;
    }
  } catch {
    // ignore parsing errors
  }
  return resolveLocaleFromList(fallback, fallback, supportedLocales);
}

export function normalizeLocale(
  input?: string | null,
  defaultLocale: Locale = DEFAULT_LOCALE,
  supportedLocales: readonly string[] = SUPPORTED_LOCALES
): Locale {
  return resolveLocaleFromList(input, defaultLocale, supportedLocales);
}
