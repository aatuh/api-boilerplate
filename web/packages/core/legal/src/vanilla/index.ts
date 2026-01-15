import type { LegalSnippet, LegalTemplate } from "../types";
import { vanillaSnippetsEn, vanillaTemplatesEn } from "./en";
import { vanillaSnippetsFi, vanillaTemplatesFi } from "./fi";

const templatesByLocale: Record<string, Record<string, LegalTemplate>> = {
  en: vanillaTemplatesEn,
  fi: vanillaTemplatesFi,
};

const snippetsByLocale: Record<string, Record<string, LegalSnippet>> = {
  en: vanillaSnippetsEn,
  fi: vanillaSnippetsFi,
};

function normalizeLocale(locale?: string | null) {
  if (!locale) return "en";
  return locale.toLowerCase().split("-")[0];
}

export function getVanillaLegalTemplate(locale: string | null | undefined, slug: string): LegalTemplate | undefined {
  const normalized = normalizeLocale(locale);
  return templatesByLocale[normalized]?.[slug];
}

export function getVanillaLegalSnippets(locale: string | null | undefined): Record<string, LegalSnippet> {
  const normalized = normalizeLocale(locale);
  return snippetsByLocale[normalized] ?? snippetsByLocale.en;
}

export function getVanillaLegalLocales() {
  return Object.keys(templatesByLocale);
}
