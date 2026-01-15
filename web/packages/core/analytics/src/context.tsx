"use client";

import {
  createContext,
  useContext,
  useMemo,
  type PropsWithChildren,
} from "react";
import type { AnalyticsClient } from "./types";
import { createNoopAnalytics } from "./client";

const AnalyticsContext = createContext<AnalyticsClient | null>(null);

export type AnalyticsProviderProps = PropsWithChildren<{
  client?: AnalyticsClient;
}>;

export function AnalyticsProvider({ client, children }: AnalyticsProviderProps) {
  const value = useMemo(
    () => client ?? createNoopAnalytics(),
    [client]
  );
  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics(): AnalyticsClient {
  const ctx = useContext(AnalyticsContext);
  return ctx ?? createNoopAnalytics();
}
