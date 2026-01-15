"use client";

import type { ConsentConfig } from "@api-boilerplate/legal";
import { CookieConsentBanner, CookieConsentProvider } from "./cookie-consent";

type CookieConsentShellProps = {
  config: ConsentConfig;
  storageKey?: string;
};

export function CookieConsentShell({ config, storageKey }: CookieConsentShellProps) {
  return (
    <CookieConsentProvider config={config} storageKey={storageKey}>
      <CookieConsentBanner />
    </CookieConsentProvider>
  );
}
