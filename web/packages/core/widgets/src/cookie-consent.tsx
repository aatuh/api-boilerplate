"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  createContext,
  useContext,
  type ReactNode,
} from "react";
import type { ConsentConfig } from "@api-boilerplate/legal";
import { useLocale } from "@api-boilerplate/i18n-shared/locale-context";
import { Button, Card, cx } from "@api-boilerplate/ui";

type ConsentContextValue = {
  config: ConsentConfig;
  preferences: Record<string, boolean>;
  hasDecision: boolean;
  open: boolean;
  showDetails: boolean;
  hasConsent: (categoryId: string, entryId?: string) => boolean;
  openManager: (opts?: { details?: boolean }) => void;
  close: () => void;
  setPreference: (key: string, value: boolean) => void;
  acceptAll: () => void;
  rejectAll: () => void;
  save: () => void;
};

const ConsentContext = createContext<ConsentContextValue | null>(null);

const STORAGE_VERSION = "v1";
const CONSENT_EVENT = "cx:consent-updated";

function entryKey(categoryId: string, entryId: string) {
  return `${categoryId}:${entryId}`;
}

function buildDefaultPreferences(config: ConsentConfig) {
  const prefs: Record<string, boolean> = {};
  config.forEach((category) => {
    category.entries.forEach((entry) => {
      const key = entryKey(category.id, entry.id);
      if (category.required || entry.required) {
        prefs[key] = true;
      } else {
        prefs[key] = entry.defaultState === "on";
      }
    });
  });
  return prefs;
}

type StoredConsent = {
  version: string;
  preferences: Record<string, boolean>;
};

type ConsentProviderProps = {
  config: ConsentConfig;
  storageKey?: string;
  children: ReactNode;
};

export function CookieConsentProvider({
  config,
  storageKey = "cookie-consent",
  children,
}: ConsentProviderProps) {
  const [preferences, setPreferences] = useState<Record<string, boolean>>({});
  const [hasDecision, setHasDecision] = useState(false);
  const [open, setOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const defaults = buildDefaultPreferences(config);
    const load = () => {
      try {
        const raw = localStorage.getItem(storageKey);
        if (!raw) {
          setPreferences(defaults);
          setHasDecision(false);
          setOpen(true);
          setShowDetails(false);
          return;
        }
        const parsed = JSON.parse(raw) as StoredConsent;
        const merged = parsed?.preferences
          ? { ...defaults, ...parsed.preferences }
          : defaults;
        const decided = Boolean(parsed?.preferences);
        setPreferences(merged);
        setHasDecision(decided);
        setOpen(!decided);
        setShowDetails(!decided);
      } catch {
        setPreferences(defaults);
        setHasDecision(false);
        setOpen(true);
        setShowDetails(false);
      }
    };
    load();
  }, [config, storageKey]);

  const persist = useCallback(
    (next: Record<string, boolean>) => {
      if (typeof window === "undefined") return;
      const payload: StoredConsent = {
        version: STORAGE_VERSION,
        preferences: next,
      };
      localStorage.setItem(storageKey, JSON.stringify(payload));
      window.dispatchEvent(new CustomEvent(CONSENT_EVENT));
    },
    [storageKey]
  );

  const requiredKeys = useMemo(() => {
    const set = new Set<string>();
    config.forEach((category) =>
      category.entries.forEach((entry) => {
        if (category.required || entry.required) {
          set.add(entryKey(category.id, entry.id));
        }
      })
    );
    return set;
  }, [config]);

  const setPreference = useCallback((key: string, value: boolean) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  }, []);

  const acceptAll = useCallback(() => {
    const next = buildDefaultPreferences(config);
    Object.keys(next).forEach((key) => {
      next[key] = true;
    });
    setPreferences(next);
    setHasDecision(true);
    persist(next);
  }, [config, persist]);

  const rejectAll = useCallback(() => {
    const next: Record<string, boolean> = {};
    const defaults = buildDefaultPreferences(config);
    Object.keys(defaults).forEach((key) => {
      next[key] = requiredKeys.has(key);
    });
    setPreferences(next);
    setHasDecision(true);
    persist(next);
  }, [config, persist, requiredKeys]);

  const save = useCallback(() => {
    setHasDecision(true);
    persist(preferences);
  }, [persist, preferences]);

  const openManager = useCallback((opts?: { details?: boolean }) => {
    setOpen(true);
    setShowDetails(opts?.details ?? true);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  const hasConsent = useCallback(
    (categoryId: string, entryId?: string) => {
      const category = config.find((c) => c.id === categoryId);
      if (!category) return false;
      if (!entryId) {
        return category.entries.every((entry) => {
          const key = entryKey(category.id, entry.id);
          const defaultAllowed =
            category.required || entry.required || entry.defaultState === "on";
          const pref = preferences[key];
          return pref ?? defaultAllowed;
        });
      }
      const entry = category.entries.find((e) => e.id === entryId);
      if (!entry) return false;
      const key = entryKey(category.id, entry.id);
      const defaultAllowed =
        category.required || entry.required || entry.defaultState === "on";
      const pref = preferences[key];
      return pref ?? defaultAllowed;
    },
    [config, preferences]
  );

  const value = useMemo<ConsentContextValue>(
    () => ({
      config,
      preferences,
      hasDecision,
      open,
      showDetails,
      hasConsent,
      openManager,
      close,
      setPreference,
      acceptAll,
      rejectAll,
      save,
    }),
    [
      acceptAll,
      close,
      config,
      hasConsent,
      hasDecision,
      open,
      openManager,
      preferences,
      rejectAll,
      save,
      setPreference,
      showDetails,
    ]
  );

  return (
    <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const ctx = useContext(ConsentContext);
  if (!ctx) {
    throw new Error(
      "useCookieConsent must be used within CookieConsentProvider"
    );
  }
  return ctx;
}

export function CookieConsentBanner() {
  const {
    config,
    preferences,
    hasDecision,
    open,
    showDetails,
    openManager,
    close,
    setPreference,
    acceptAll,
    rejectAll,
    save,
  } = useCookieConsent();
  const { t } = useLocale();

  if (!open || config.length === 0) return null;

  const requiredLabel = t("common.cookieConsent.required");
  const alwaysOn = t("common.cookieConsent.alwaysOn");

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      <div
        className="pointer-events-auto fixed inset-x-4 bottom-4 sm:left-auto sm:right-4 sm:w-105"
        style={{ overscrollBehavior: "contain" }}
      >
        <Card className="shadow-xl max-h-[80vh] overflow-hidden">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-strong">
                {t("common.cookieConsent.title")}
              </p>
              <p className="text-sm text-muted">
                {t("common.cookieConsent.description")}
              </p>
            </div>
            {hasDecision ? (
              <button
                className="text-xs font-semibold text-muted-strong transition hover:text-foreground"
                onClick={() => close()}
                aria-label={t("common.actions.close")}
              >
                ✕
              </button>
            ) : null}
          </div>

          {showDetails ? (
            <div
              className="mt-4 flex max-h-[60vh] flex-col gap-3 overflow-y-auto pr-1"
              style={{
                overscrollBehavior: "contain",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {config.map((category) => (
                <div
                  key={category.id}
                  className="rounded-2xl border border-border px-3 py-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {category.title}
                      </p>
                      {category.description ? (
                        <p className="text-xs text-muted">
                          {category.description}
                        </p>
                      ) : null}
                    </div>
                    {category.required ? (
                      <span className="rounded-full bg-surface-muted px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-strong">
                        {alwaysOn}
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-3 space-y-2">
                    {category.entries.map((entry) => {
                      const key = entryKey(category.id, entry.id);
                      const isRequired = category.required || entry.required;
                      const checked =
                        preferences[key] ??
                        (isRequired ? true : entry.defaultState === "on");
                      return (
                        <label
                          key={key}
                          className={cx(
                            "flex items-start gap-3 rounded-xl px-2 py-2 transition",
                            isRequired
                              ? "cursor-default"
                              : "cursor-pointer hover:bg-surface-muted"
                          )}
                        >
                          <input
                            type="checkbox"
                            className="mt-1 h-4 w-4 cursor-pointer accent-primary disabled:cursor-not-allowed"
                            disabled={isRequired}
                            checked={checked}
                            onChange={(e) =>
                              setPreference(key, e.target.checked)
                            }
                          />
                          <div className="space-y-1">
                            <p className="text-sm font-semibold text-foreground">
                              {entry.label}{" "}
                              {isRequired ? (
                                <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-strong">
                                  {requiredLabel}
                                </span>
                              ) : null}
                            </p>
                            {entry.description ? (
                              <p className="text-xs text-muted">
                                {entry.description}
                              </p>
                            ) : null}
                            {entry.cookies && entry.cookies.length > 0 ? (
                              <p className="text-[11px] text-muted">
                                {t("common.cookieConsent.cookies", {
                                  list: entry.cookies.join(", "),
                                })}
                              </p>
                            ) : null}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => {
                    save();
                    close();
                  }}
                  size="md"
                >
                  {t("common.cookieConsent.save")}
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => {
                    acceptAll();
                    close();
                  }}
                >
                  {t("common.cookieConsent.acceptAll")}
                </Button>
                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => {
                    rejectAll();
                    close();
                  }}
                >
                  {t("common.cookieConsent.reject")}
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                onClick={() => {
                  acceptAll();
                  close();
                }}
                size="md"
              >
                {t("common.cookieConsent.acceptAll")}
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={() => {
                  rejectAll();
                  close();
                }}
              >
                {t("common.cookieConsent.reject")}
              </Button>
              <Button
                variant="ghost"
                size="md"
                onClick={() => openManager({ details: true })}
              >
                {t("common.cookieConsent.manage")}
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
