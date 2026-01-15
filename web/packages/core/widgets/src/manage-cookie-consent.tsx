"use client";

import { Button } from "@api-boilerplate/ui";
import { useLocale } from "@api-boilerplate/i18n-shared/locale-context";
import { useCookieConsent } from "./cookie-consent";

type ManageCookieConsentProps = {
  className?: string;
};

export function ManageCookieConsent({ className }: ManageCookieConsentProps) {
  const { t } = useLocale();
  const { openManager, config } = useCookieConsent();

  if (!config.length) return null;

  return (
    <div className={className}>
      <Button variant="secondary" size="md" onClick={() => openManager({ details: true })}>
        {t("common.cookieConsent.manage")}
      </Button>
    </div>
  );
}
