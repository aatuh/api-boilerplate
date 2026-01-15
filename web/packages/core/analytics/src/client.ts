import type { AnalyticsClient } from "./types";

export function createNoopAnalytics(): AnalyticsClient {
  return {
    trackEvent: () => {},
    trackPageview: () => {},
  };
}
