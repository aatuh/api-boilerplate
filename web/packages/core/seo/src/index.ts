import type { Metadata } from "next";
import {
  DEFAULT_LOCALE as DEFAULT_I18N_LOCALE,
  SUPPORTED_LOCALES as DEFAULT_I18N_LOCALES,
  normalizeLocale as normalizeLocaleShared,
} from "@api-boilerplate/i18n-shared/config";

export type BuildPageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  locale?: string;
  index?: boolean;
  siteName?: string;
  siteUrl?: URL;
  defaultLocale?: string;
  supportedLocales?: readonly string[];
  normalizeLocale?: (input?: string | null, defaultLocale?: string) => string;
  ogLocale?: string;
};

function toOpenGraphLocale(locale: string): string {
  const trimmed = locale.trim().toLowerCase();
  if (!trimmed) return "en_US";
  const parts = trimmed.split("-");
  if (parts.length > 1 && parts[1]) {
    return `${parts[0]}_${parts[1].toUpperCase()}`;
  }
  if (trimmed === "fi") return "fi_FI";
  if (trimmed === "sv") return "sv_SE";
  if (trimmed === "en") return "en_US";
  return "en_US";
}

export function getSiteUrl(fallback = "http://localhost:3000"): URL {
  const raw =
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
    fallback;
  try {
    return new URL(raw);
  } catch {
    return new URL(fallback);
  }
}

export function buildPageMetadata(options: BuildPageMetadataOptions): Metadata {
  const siteUrl = options.siteUrl ?? getSiteUrl();
  const supportedLocales = options.supportedLocales ?? DEFAULT_I18N_LOCALES;
  const defaultLocale = (options.defaultLocale ?? DEFAULT_I18N_LOCALE).toLowerCase();
  const normalizeLocale =
    options.normalizeLocale ??
    ((input?: string | null, fallback: string = defaultLocale) =>
      normalizeLocaleShared(input, fallback, supportedLocales));
  const normalizedLocale = normalizeLocale(options.locale ?? defaultLocale, defaultLocale);
  const normalizedPath = options.path === "/" ? "" : options.path;
  const canonicalUrl = new URL(`/${normalizedLocale}${normalizedPath}`, siteUrl).toString();
  const index = options.index ?? true;
  const languages: Record<string, string> = {};
  for (const locale of supportedLocales) {
    const hrefLang = locale === "fi" ? "fi-FI" : locale;
    languages[hrefLang] = new URL(`/${locale}${normalizedPath}`, siteUrl).toString();
  }
  languages["x-default"] = new URL(`/${defaultLocale}${normalizedPath}`, siteUrl).toString();

  const openGraph: NonNullable<Metadata["openGraph"]> = {
    title: options.title,
    description: options.description,
    url: canonicalUrl,
    locale: options.ogLocale ?? toOpenGraphLocale(normalizedLocale),
    type: "website",
  };
  if (options.siteName) {
    openGraph.siteName = options.siteName;
  }

  return {
    metadataBase: siteUrl,
    title: options.title,
    description: options.description,
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
    robots: {
      index,
      follow: index,
    },
    openGraph,
  };
}
