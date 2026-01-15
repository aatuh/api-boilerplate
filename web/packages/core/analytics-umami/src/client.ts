import { createNoopAnalytics } from "@api-boilerplate/analytics";
import type {
  AnalyticsClient,
  AnalyticsEvent,
  PageViewEvent,
} from "@api-boilerplate/analytics";

export type UmamiOptions = {
  websiteId: string;
  scriptUrl?: string;
  host?: string;
};

const loadedScripts = new Set<string>();

function resolveScriptUrl(options: UmamiOptions) {
  if (options.scriptUrl) return options.scriptUrl;
  if (options.host) {
    return `${options.host.replace(/\/+$/, "")}/script.js`;
  }
  return "https://analytics.umami.is/script.js";
}

function ensureScript(opts: UmamiOptions) {
  if (typeof document === "undefined") return;
  const src = resolveScriptUrl(opts);
  const key = `${src}::${opts.websiteId}`;
  if (loadedScripts.has(key)) return;
  const existing = document.querySelector<HTMLScriptElement>(
    `script[data-website-id="${opts.websiteId}"]`
  );
  if (existing) {
    loadedScripts.add(key);
    return;
  }
  const script = document.createElement("script");
  script.async = true;
  script.defer = true;
  script.src = src;
  script.setAttribute("data-website-id", opts.websiteId);
  document.head.appendChild(script);
  loadedScripts.add(key);
}

export function createUmamiAnalytics(opts: UmamiOptions): AnalyticsClient {
  if (typeof window === "undefined") return createNoopAnalytics();
  ensureScript(opts);

  const resolveUmami = () => {
    // @ts-expect-error umami is injected by the script
    return window.umami as
      | undefined
      | {
          track?: (eventName: string, eventData?: Record<string, unknown>) => void;
          trackView?: (url?: string, referrer?: string) => void;
        };
  };

  return {
    trackEvent: (event: AnalyticsEvent) => {
      const umami = resolveUmami();
      if (!umami?.track) return;
      umami.track(event.name, event.props);
    },
    trackPageview: (event?: PageViewEvent) => {
      const umami = resolveUmami();
      if (!umami) return;
      if (umami.trackView) {
        umami.trackView(event?.url, event?.referrer);
        return;
      }
      if (umami.track) {
        umami.track("pageview", {
          url: event?.url,
          referrer: event?.referrer,
          ...(event?.props ? { data: event.props } : {}),
        });
      }
    },
  };
}
