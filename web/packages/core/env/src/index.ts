import { z } from "zod";

type RuntimeEnv = Record<string, string | undefined>;

type EnvOptions = {
  runtimeEnv?: RuntimeEnv;
  strict?: boolean;
  skipValidation?: boolean;
  label?: string;
};

function shouldBeStrict(strict?: boolean): boolean {
  if (typeof strict === "boolean") return strict;
  return process.env.NODE_ENV !== "production" || process.env.CI === "true";
}

function formatEnvError(label: string, error: z.ZodError) {
  const issues = error.issues
    .map((issue) => `${issue.path.join(".") || "root"}: ${issue.message}`)
    .join("; ");
  return `[env] Invalid ${label}: ${issues}`;
}

function pickEnv(runtimeEnv: RuntimeEnv, keys: string[]): RuntimeEnv {
  const picked: RuntimeEnv = {};
  for (const key of keys) {
    picked[key] = runtimeEnv[key];
  }
  return picked;
}

export function createEnv<T extends z.ZodRawShape>(shape: T, options?: EnvOptions): z.infer<z.ZodObject<T>> {
  const schema = z.object(shape);
  const label = options?.label || "environment variables";
  const runtimeEnv = options?.runtimeEnv ?? process.env;
  if (options?.skipValidation) {
    return runtimeEnv as z.infer<z.ZodObject<T>>;
  }
  const result = schema.safeParse(runtimeEnv);
  if (result.success) return result.data;
  const strict = shouldBeStrict(options?.strict);
  const message = formatEnvError(label, result.error);
  if (strict) {
    throw new Error(message);
  }
  console.warn(message);
  return runtimeEnv as z.infer<z.ZodObject<T>>;
}

export function createClientEnv<T extends z.ZodRawShape>(
  shape: T,
  options?: EnvOptions & { clientPrefix?: string }
): z.infer<z.ZodObject<T>> {
  const prefix = options?.clientPrefix ?? "NEXT_PUBLIC_";
  const keys = Object.keys(shape);
  const invalid = keys.filter((key) => !key.startsWith(prefix));
  if (invalid.length > 0) {
    const message = `[env] Client env schema includes non-public keys: ${invalid.join(", ")}`;
    if (shouldBeStrict(options?.strict)) {
      throw new Error(message);
    }
    console.warn(message);
  }
  const runtimeEnv = options?.runtimeEnv ?? process.env;
  return createEnv(shape, {
    ...options,
    runtimeEnv: pickEnv(runtimeEnv, keys),
    label: options?.label || "client environment variables",
  });
}

export function createServerEnv<T extends z.ZodRawShape>(shape: T, options?: EnvOptions): z.infer<z.ZodObject<T>> {
  return createEnv(shape, { ...options, label: options?.label || "server environment variables" });
}

export function parseFlag(value: string | undefined, fallback: boolean): boolean {
  if (typeof value !== "string") return fallback;
  const normalized = value.trim().toLowerCase();
  if (["1", "true", "yes", "on"].includes(normalized)) return true;
  if (["0", "false", "no", "off"].includes(normalized)) return false;
  return fallback;
}
