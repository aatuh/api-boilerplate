import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type Locale } from "./config";

type LocaleRouteParams = {
  locale: Locale;
  pathname: string;
  searchParams?: string | null;
  availableLocales?: readonly Locale[];
};

export type LocaleRouteAdapter = {
  buildHref: (params: LocaleRouteParams) => string;
  shouldRefresh?: boolean;
};

function ensurePathname(pathname: string): string {
  if (!pathname) return "/";
  return pathname.startsWith("/") ? pathname : `/${pathname}`;
}

function normalizeLocales(locales?: readonly Locale[]): readonly string[] {
  return (locales && locales.length > 0 ? locales : SUPPORTED_LOCALES).map((loc) => loc.toLowerCase());
}

export function stripLocalePrefix(pathname: string, locales?: readonly Locale[]): string {
  const safePath = ensurePathname(pathname);
  const segments = safePath.split("/").filter(Boolean);
  if (segments.length === 0) return "/";
  const normalizedLocales = normalizeLocales(locales);
  const head = segments[0]?.toLowerCase();
  if (head && normalizedLocales.includes(head)) {
    const rest = segments.slice(1).join("/");
    return rest ? `/${rest}` : "/";
  }
  return safePath;
}

export function createQueryLocaleAdapter(options?: { paramName?: string }): LocaleRouteAdapter {
  const paramName = options?.paramName ?? "lang";
  return {
    buildHref: ({ locale, pathname, searchParams, availableLocales }) => {
      const params = new URLSearchParams(searchParams || "");
      params.set(paramName, locale);
      const basePath = stripLocalePrefix(pathname, availableLocales);
      const query = params.toString();
      return query ? `${basePath}?${query}` : basePath;
    },
    shouldRefresh: true,
  };
}

export function createPathLocaleAdapter(options?: { defaultLocale?: Locale; includeDefault?: boolean }): LocaleRouteAdapter {
  const defaultLocale = options?.defaultLocale ?? DEFAULT_LOCALE;
  const includeDefault = options?.includeDefault ?? true;
  return {
    buildHref: ({ locale, pathname, searchParams, availableLocales }) => {
      const basePath = stripLocalePrefix(pathname, availableLocales);
      const params = new URLSearchParams(searchParams || "");
      params.delete("lang");
      const query = params.toString();
      const prefix = !includeDefault && locale === defaultLocale ? "" : `/${locale}`;
      const path = `${prefix}${basePath === "/" ? "" : basePath}` || "/";
      return query ? `${path}?${query}` : path;
    },
    shouldRefresh: false,
  };
}

export const queryLocaleAdapter = createQueryLocaleAdapter();
