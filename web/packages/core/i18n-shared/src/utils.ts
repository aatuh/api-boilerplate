import type { DeepPartial } from "./shared";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function deepMerge<T>(base: T, override: DeepPartial<T>): T {
  const result: Record<string, unknown> = Array.isArray(base) ? {} : { ...(base as Record<string, unknown>) };

  for (const key of Object.keys(override) as Array<keyof T>) {
    const baseVal = (base as Record<string, unknown>)[key as string];
    const overrideVal = (override as Record<string, unknown>)[key as string];

    if (overrideVal === undefined || overrideVal === null || overrideVal === "") {
      continue;
    }

    if (Array.isArray(baseVal) && Array.isArray(overrideVal)) {
      result[key as string] = overrideVal;
    } else if (isRecord(baseVal) && isRecord(overrideVal)) {
      result[key as string] = deepMerge(baseVal, overrideVal);
    } else {
      result[key as string] = overrideVal;
    }
  }

  return result as T;
}

export function findMissingKeys<T extends Record<string, unknown>>(base: T, override: Partial<T>): string[] {
  const missing: string[] = [];

  const walk = (baseNode: unknown, overrideNode: unknown, path: string[] = []) => {
    if (typeof baseNode === "string") {
      if (overrideNode === undefined || overrideNode === null || overrideNode === "") {
        missing.push(path.join("."));
      }
      return;
    }

    if (Array.isArray(baseNode)) {
      // Arrays are treated as whole units: if override array is missing, mark the key.
      if (!Array.isArray(overrideNode)) {
        missing.push(path.join("."));
      }
      return;
    }

    if (isRecord(baseNode)) {
      for (const [key, val] of Object.entries(baseNode)) {
        const nextPath = [...path, key];
        const overrideVal = isRecord(overrideNode) ? overrideNode[key] : undefined;
        walk(val, overrideVal, nextPath);
      }
    }
  };

  walk(base, override, []);
  return missing;
}
