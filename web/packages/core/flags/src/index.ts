import { parseFlag } from "@api-boilerplate/env";

export type FeatureFlags<T extends Record<string, boolean>> = Readonly<T>;

export function createFeatureFlags<T extends Record<string, boolean>>(
  defaults: T,
  overrides?: Partial<T>
): FeatureFlags<T> {
  return { ...defaults, ...overrides } as FeatureFlags<T>;
}

export function resolveFeatureFlags<T extends Record<string, boolean>>(
  defaults: T,
  env?: Partial<Record<keyof T, string | undefined>>,
  overrides?: Partial<T>
): FeatureFlags<T> {
  const parsed: Partial<T> = {};
  if (env) {
    for (const key of Object.keys(defaults) as Array<keyof T>) {
      if (key in env) {
        parsed[key] = parseFlag(env[key], defaults[key]) as T[typeof key];
      }
    }
  }
  return createFeatureFlags(defaults, { ...parsed, ...overrides });
}
