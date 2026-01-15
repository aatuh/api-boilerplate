"use client";

import { useMemo, type PropsWithChildren } from "react";
import { AnalyticsProvider, createNoopAnalytics } from "@api-boilerplate/analytics";
import { useCookieConsent } from "@api-boilerplate/widgets";
import { CONSENT_CATEGORY_IDS, CONSENT_ENTRY_IDS } from "@api-boilerplate/legal";
import { createPlausibleAnalytics } from "./client";

export type PlausibleAnalyticsGateProps = PropsWithChildren<{
  enabled?: boolean;
  domain?: string | null;
  apiHost?: string | null;
  trackLocalhost?: boolean;
}>;

export function PlausibleAnalyticsGate({
  children,
  enabled = false,
  domain,
  apiHost,
  trackLocalhost,
}: PlausibleAnalyticsGateProps) {
  const { hasConsent } = useCookieConsent();
  const isEnabled = enabled && Boolean(domain);

  const client = useMemo(() => {
    if (!isEnabled || !domain) {
      return createNoopAnalytics();
    }
    return createPlausibleAnalytics({
      domain,
      apiHost: apiHost ?? undefined,
      trackLocalhost: Boolean(trackLocalhost),
    });
  }, [apiHost, domain, isEnabled, trackLocalhost]);

  const allowed = hasConsent(
    CONSENT_CATEGORY_IDS.ANALYTICS,
    CONSENT_ENTRY_IDS.PLAUSIBLE
  );

  const activeClient = useMemo(
    () => (allowed ? client : createNoopAnalytics()),
    [allowed, client]
  );

  return <AnalyticsProvider client={activeClient}>{children}</AnalyticsProvider>;
}
