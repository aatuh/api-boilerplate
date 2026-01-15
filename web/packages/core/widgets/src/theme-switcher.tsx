"use client";

import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useThemeMode } from "@api-boilerplate/theme";
import { useLocale } from "@api-boilerplate/i18n-shared/locale-context";
import { Button } from "@api-boilerplate/ui";

type ThemeSwitcherProps = {
  compact?: boolean;
};

export function ThemeSwitcher({ compact }: ThemeSwitcherProps) {
  const { theme, setTheme, toggle } = useThemeMode();
  const { t } = useLocale();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const currentLabel =
    theme === "system"
      ? t("common.footer.themeSystem")
      : theme === "dark"
        ? t("common.footer.themeDark")
        : t("common.footer.themeLight");
  const icon =
    theme === "system" ? (
      <Monitor className="h-4 w-4 shrink-0" />
    ) : theme === "dark" ? (
      <Moon className="h-4 w-4 shrink-0" />
    ) : (
      <Sun className="h-4 w-4 shrink-0" />
    );

  if (compact) {
    return (
      <Button
        variant="ghost"
        size="md"
        onClick={toggle}
        className="h-9 w-9 !px-0 !py-0 text-xs"
        aria-label={currentLabel}
        title={currentLabel}
      >
        {icon}
      </Button>
    );
  }

  return (
    <div className="inline-flex items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-strong">
        {t("common.footer.themeLabel")}
      </span>
      <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-2 py-1">
        {[
          { value: "system", label: t("common.footer.themeSystem"), icon: <Monitor className="h-4 w-4" /> },
          { value: "light", label: t("common.footer.themeLight"), icon: <Sun className="h-4 w-4" /> },
          { value: "dark", label: t("common.footer.themeDark"), icon: <Moon className="h-4 w-4" /> },
        ].map((opt) => (
          <button
            key={opt.value}
            onClick={() => setTheme(opt.value as "light" | "dark" | "system")}
            className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold transition ${
              theme === opt.value
                ? "bg-primary-soft text-primary"
                : "text-muted-strong hover:bg-surface-muted"
            }`}
            aria-pressed={theme === opt.value}
            aria-label={opt.label}
          >
            {opt.icon}
            <span className="hidden sm:inline">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
