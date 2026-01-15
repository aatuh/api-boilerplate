import { createClientEnv } from "@api-boilerplate/env";
import { z } from "zod";

type RuntimeEnv = Record<string, string | undefined>;

export type UmamiEnvConfig = {
  websiteId?: string;
  host?: string;
  scriptUrl?: string;
};

export function createUmamiEnv(runtimeEnv: RuntimeEnv = process.env): UmamiEnvConfig {
  const env = createClientEnv(
    {
      NEXT_PUBLIC_UMAMI_WEBSITE_ID: z.string().optional(),
      NEXT_PUBLIC_UMAMI_HOST: z.union([z.string().url(), z.literal("")]).optional(),
      NEXT_PUBLIC_UMAMI_SCRIPT_URL: z.union([z.string().url(), z.literal("")]).optional(),
    },
    {
      label: "umami environment variables",
      runtimeEnv: {
        NEXT_PUBLIC_UMAMI_WEBSITE_ID: runtimeEnv.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
        NEXT_PUBLIC_UMAMI_HOST: runtimeEnv.NEXT_PUBLIC_UMAMI_HOST,
        NEXT_PUBLIC_UMAMI_SCRIPT_URL: runtimeEnv.NEXT_PUBLIC_UMAMI_SCRIPT_URL,
      },
    }
  );

  const websiteId = env.NEXT_PUBLIC_UMAMI_WEBSITE_ID?.trim();
  const host = env.NEXT_PUBLIC_UMAMI_HOST?.trim();
  const scriptUrl = env.NEXT_PUBLIC_UMAMI_SCRIPT_URL?.trim();

  return {
    websiteId: websiteId || undefined,
    host: host || undefined,
    scriptUrl: scriptUrl || undefined,
  };
}
