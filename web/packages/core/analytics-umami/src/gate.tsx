"use client";

import { useMemo, type PropsWithChildren } from "react";
import {
  AnalyticsProvider,
  createNoopAnalytics,
} from "@api-boilerplate/analytics";
import { useCookieConsent } from "@api-boilerplate/widgets";
import {
  CONSENT_CATEGORY_IDS,
  CONSENT_ENTRY_IDS,
} from "@api-boilerplate/legal";
import { createUmamiAnalytics } from "./client";

export type UmamiAnalyticsGateProps = PropsWithChildren<{
  enabled?: boolean;
  websiteId?: string | null;
  host?: string | null;
  scriptUrl?: string | null;
}>;

export function UmamiAnalyticsGate({
  children,
  enabled = false,
  websiteId,
  host,
  scriptUrl,
}: UmamiAnalyticsGateProps) {
  const { hasConsent } = useCookieConsent();
  const isEnabled = enabled && Boolean(websiteId);

  const client = useMemo(() => {
    if (!isEnabled || !websiteId) {
      return createNoopAnalytics();
    }
    return createUmamiAnalytics({
      websiteId,
      host: host ?? undefined,
      scriptUrl: scriptUrl ?? undefined,
    });
  }, [host, isEnabled, scriptUrl, websiteId]);

  const allowed = hasConsent(
    CONSENT_CATEGORY_IDS.ANALYTICS,
    CONSENT_ENTRY_IDS.UMAMI
  );

  const activeClient = useMemo(
    () => (allowed ? client : createNoopAnalytics()),
    [allowed, client]
  );

  return (
    <AnalyticsProvider client={activeClient}>{children}</AnalyticsProvider>
  );
}
