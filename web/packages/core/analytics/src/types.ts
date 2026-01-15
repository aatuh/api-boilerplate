export type AnalyticsEvent = {
  name: string;
  props?: Record<string, unknown>;
};

export type PageViewEvent = {
  url?: string;
  referrer?: string;
  props?: Record<string, unknown>;
};

export type AnalyticsClient = {
  trackEvent: (event: AnalyticsEvent) => void;
  trackPageview: (event?: PageViewEvent) => void;
};
