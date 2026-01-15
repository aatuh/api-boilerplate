"use client";

import { startTransition, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SUPPORTED_LOCALES, type Locale } from "@api-boilerplate/i18n-shared/config";
import { queryLocaleAdapter, type LocaleRouteAdapter } from "@api-boilerplate/i18n-shared/locale-routing";
import { useLocale } from "@api-boilerplate/i18n-shared/locale-context";

type LanguageSwitcherProps = {
  compact?: boolean;
  locales?: Locale[];
  adapter?: LocaleRouteAdapter;
};

const defaultAdapter = queryLocaleAdapter;

export function LanguageSwitcher({ compact, locales, adapter }: LanguageSwitcherProps) {
  const { locale, t } = useLocale();
  const [selected, setSelected] = useState<Locale>(locale);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const availableLocales = locales && locales.length > 0 ? locales : SUPPORTED_LOCALES;
  const resolvedAdapter = adapter ?? defaultAdapter;

  useEffect(() => {
    setSelected(locale);
  }, [locale]);

  const updateLocale = (next: Locale) => {
    setSelected(next);
    const nextHref = resolvedAdapter.buildHref({
      locale: next,
      pathname: pathname || "/",
      searchParams: searchParams?.toString(),
      availableLocales,
    });
    startTransition(() => {
      router.replace(nextHref, { scroll: false });
      if (resolvedAdapter.shouldRefresh ?? true) {
        router.refresh();
      }
    });
  };

  return (
    <div className="flex items-center gap-2 text-sm text-muted-strong">
      {compact ? null : (
        <span className="text-xs font-semibold uppercase tracking-[0.15em]">
          {t("common.footer.languageLabel")}
        </span>
      )}
      <div className="flex gap-2">
        {availableLocales.map((loc) => (
          <button
            key={loc}
            onClick={() => updateLocale(loc)}
            className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
              selected === loc
                ? "border-primary bg-primary-soft text-primary"
                : "border-border text-muted-strong hover:border-primary"
            } ${compact ? "px-2 py-1 text-[11px]" : ""}`}
            aria-pressed={selected === loc}
            aria-label={getLocaleLabel(loc, locale, t)}
          >
            {compact ? loc.toUpperCase() : getLocaleLabel(loc, locale, t)}
          </button>
        ))}
      </div>
    </div>
  );
}

function getLocaleLabel(code: string, displayLocale: string, t: (key: string) => string) {
  if (code === "fi") return t("common.footer.languageFinnish");
  if (code === "en") return t("common.footer.languageEnglish");
  return code.toUpperCase();
}
