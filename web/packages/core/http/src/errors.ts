import { HttpError } from "./client";

export function isHttpError(err: unknown): err is HttpError {
  return err instanceof HttpError;
}

export type HttpErrorField = {
  field?: string;
  message?: string;
  code?: string;
};

export type HttpErrorMeta = {
  code?: string;
  title?: string;
  detail?: string;
  status?: number;
  fields?: HttpErrorField[];
};

export type ErrorTranslationMap = {
  codes?: Record<string, string>;
  titles?: Record<string, string>;
  details?: Record<string, string>;
};

type Translator = (key: string, params?: Record<string, string | number>) => string;

function normalizeCode(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9._-]+/g, "_");
}

function extractCode(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const parts = trimmed.split(/[/:#]/).filter(Boolean);
  const last = parts[parts.length - 1];
  return last ? normalizeCode(last) : undefined;
}

function parseFields(payload: Record<string, unknown>): HttpErrorField[] | undefined {
  const errors = payload.errors;
  if (Array.isArray(errors)) {
    return errors
      .map((entry) => {
        if (!entry || typeof entry !== "object") return null;
        const err = entry as Record<string, unknown>;
        const field = typeof err.field === "string" ? err.field : undefined;
        const message = typeof err.message === "string" ? err.message : undefined;
        const code = extractCode(err.code);
        return field || message || code ? { field, message, code } : null;
      })
      .filter(Boolean) as HttpErrorField[];
  }
  const fieldErrors = payload.field_errors;
  if (fieldErrors && typeof fieldErrors === "object") {
    return Object.entries(fieldErrors as Record<string, unknown>).map(([field, message]) => ({
      field,
      message: typeof message === "string" ? message : undefined,
    }));
  }
  return undefined;
}

export function getHttpErrorMeta(err: unknown): HttpErrorMeta | null {
  if (!isHttpError(err)) return null;
  const meta: HttpErrorMeta = {
    status: err.status,
    title: err.problem?.title,
    detail: err.problem?.detail,
  };
  const code = extractCode(err.problem?.type) || extractCode((err.body as Record<string, unknown> | null)?.["error_code"]);
  meta.code = code;

  if (err.body && typeof err.body === "object") {
    const payload = err.body as Record<string, unknown>;
    meta.title = meta.title || (typeof payload.title === "string" ? payload.title : undefined);
    meta.detail = meta.detail || (typeof payload.detail === "string" ? payload.detail : undefined);
    meta.code =
      meta.code ||
      extractCode(payload.type) ||
      extractCode(payload.code) ||
      extractCode(payload.error) ||
      extractCode(payload.errorCode);
    meta.fields = parseFields(payload);
  }

  return meta;
}

function normalizeKey(value: string) {
  return value.trim().toLowerCase();
}

function lookupTranslation(
  t: Translator,
  value: string | undefined,
  map?: Record<string, string>
): string | undefined {
  if (!value || !map) return undefined;
  const key = map[normalizeKey(value)];
  return key ? t(key) : undefined;
}

export function resolveHttpErrorMessage(
  err: unknown,
  t: Translator,
  fallback: string,
  mapping?: ErrorTranslationMap
): string {
  const meta = getHttpErrorMeta(err);
  if (!meta) return fallback;

  const codeMessage = mapping?.codes
    ? lookupTranslation(t, meta.code, mapping.codes)
    : undefined;
  if (codeMessage) return codeMessage;

  const titleMessage = mapping?.titles
    ? lookupTranslation(t, meta.title, mapping.titles)
    : undefined;
  if (titleMessage) return titleMessage;

  const detailMessage = mapping?.details
    ? lookupTranslation(t, meta.detail, mapping.details)
    : undefined;
  if (detailMessage) return detailMessage;

  return fallback;
}

/**
 * Produces a user-facing message from a HttpError while avoiding leaking raw
 * technical details.
 */
export function describeHttpError(err: unknown, fallback: string): string {
  if (!isHttpError(err)) return fallback;
  const detail = err.problem?.detail || err.problem?.title || (typeof err.body === "string" ? err.body : undefined);
  return detail || fallback;
}
