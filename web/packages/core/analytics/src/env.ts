import { createClientEnv } from "@api-boilerplate/env";
import { z } from "zod";

type RuntimeEnv = Record<string, string | undefined>;

export type AnalyticsEnvConfig = {
  enabled: boolean;
  trackLocalhost: boolean;
};

export function createAnalyticsEnv(
  runtimeEnv: RuntimeEnv = process.env
): AnalyticsEnvConfig {
  const env = createClientEnv(
    {
      NEXT_PUBLIC_ANALYTICS_ENABLED: z.string().optional(),
      NEXT_PUBLIC_ANALYTICS_TRACK_LOCALHOST: z.string().optional(),
    },
    {
      label: "analytics environment variables",
      runtimeEnv: {
        NEXT_PUBLIC_ANALYTICS_ENABLED: runtimeEnv.NEXT_PUBLIC_ANALYTICS_ENABLED,
        NEXT_PUBLIC_ANALYTICS_TRACK_LOCALHOST:
          runtimeEnv.NEXT_PUBLIC_ANALYTICS_TRACK_LOCALHOST,
      },
    }
  );
  return {
    enabled: env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true",
    trackLocalhost: env.NEXT_PUBLIC_ANALYTICS_TRACK_LOCALHOST === "true",
  };
}
