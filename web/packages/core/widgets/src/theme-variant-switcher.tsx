"use client";

import { useThemeVariant } from "@api-boilerplate/theme";
import { useLocale } from "@api-boilerplate/i18n-shared/locale-context";

type ThemeVariantSwitcherProps = {
  compact?: boolean;
};

export function ThemeVariantSwitcher({ compact }: ThemeVariantSwitcherProps) {
  const { variant, setVariant, variants } = useThemeVariant();
  const { t } = useLocale();
  const label = t("common.footer.themeVariantLabel");

  if (!variants || variants.length === 0) return null;

  return (
    <div className="flex items-center gap-2 text-sm text-muted-strong">
      {compact ? null : <span className="text-xs font-semibold uppercase tracking-[0.15em]">{label}</span>}
      <div className="flex gap-2">
        {variants.map((opt) => (
          <button
            key={opt.name}
            onClick={() => setVariant(opt.name)}
            className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
              variant === opt.name
                ? "border-primary bg-primary-soft text-primary"
                : "border-border text-muted-strong hover:border-primary"
            } ${compact ? "px-2 py-1 text-[11px]" : ""}`}
            aria-pressed={variant === opt.name}
            aria-label={opt.label}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
