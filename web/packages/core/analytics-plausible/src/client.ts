import { createNoopAnalytics } from "@api-boilerplate/analytics";
import type {
  AnalyticsClient,
  PageViewEvent,
  AnalyticsEvent,
} from "@api-boilerplate/analytics";

export type PlausibleOptions = {
  domain: string;
  apiHost?: string;
  trackLocalhost?: boolean;
};

const loadedScripts = new Set<string>();

function ensureScript(opts: PlausibleOptions) {
  if (typeof document === "undefined") return;
  const src = `${opts.apiHost ?? "https://plausible.io"}/js/script.js`;
  const key = `${src}::${opts.domain}`;
  if (loadedScripts.has(key)) return;
  const existing = document.querySelector<HTMLScriptElement>(
    `script[data-plausible-domain="${opts.domain}"]`
  );
  if (existing) {
    loadedScripts.add(key);
    return;
  }
  const script = document.createElement("script");
  script.defer = true;
  script.src = src;
  script.setAttribute("data-domain", opts.domain);
  if (opts.apiHost) {
    script.setAttribute("data-api", `${opts.apiHost}/api/event`);
  }
  if (opts.trackLocalhost) {
    script.setAttribute("data-track-localhost", "true");
  }
  document.head.appendChild(script);
  loadedScripts.add(key);
}

export function createPlausibleAnalytics(
  opts: PlausibleOptions
): AnalyticsClient {
  if (typeof window === "undefined") return createNoopAnalytics();
  ensureScript(opts);

  const call = (
    event: string,
    payload?: {
      props?: Record<string, unknown>;
      u?: string;
      referrer?: string;
    }
  ) => {
    // @ts-expect-error plausible is injected by the script
    const plausible = window.plausible as
      | undefined
      | ((
          name: string,
          options?: {
            props?: Record<string, unknown>;
            u?: string;
            referrer?: string;
          }
        ) => void);
    if (!plausible) return;
    plausible(event, payload);
  };

  return {
    trackEvent: (event: AnalyticsEvent) => {
      call(event.name, event.props ? { props: event.props } : undefined);
    },
    trackPageview: (event?: PageViewEvent) => {
      const payload: Record<string, unknown> = {};
      if (event?.url) payload.u = event.url;
      if (event?.referrer) payload.referrer = event.referrer;
      if (event?.props) payload.props = event.props;
      call("pageview", Object.keys(payload).length ? payload : undefined);
    },
  };
}
