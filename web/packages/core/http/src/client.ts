export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export type ProblemDetails = {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  [key: string]: unknown;
};

export type HttpRequest = {
  path: string;
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
  signal?: AbortSignal;
  /** Optional per-request timeout override (ms). */
  timeoutMs?: number;
};

export type HttpResult<T> = {
  data: T;
  status: number;
  headers: Headers;
};

export interface HttpClient {
  request<T>(input: HttpRequest): Promise<HttpResult<T>>;
}

export class HttpError extends Error {
  status: number;
  body: unknown;
  problem?: ProblemDetails;
  isNetwork: boolean;
  isTimeout: boolean;
  attempt: number;

  constructor(message: string, status: number, body: unknown, problem?: ProblemDetails, flags?: { network?: boolean; timeout?: boolean; attempt?: number }) {
    super(message);
    this.status = status;
    this.body = body;
    this.problem = problem;
    this.isNetwork = Boolean(flags?.network);
    this.isTimeout = Boolean(flags?.timeout);
    this.attempt = flags?.attempt ?? 0;
  }
}

type HttpClientOptions = {
  baseUrl: string;
  timeoutMs: number;
  retries: number;
  retryBackoffMs: number;
  retryStatusCodes: number[];
  fetchImpl?: typeof fetch;
};

const defaultOptions: HttpClientOptions = {
  baseUrl: "",
  timeoutMs: 12000,
  retries: 2,
  retryBackoffMs: 300,
  retryStatusCodes: [408, 429, 500, 502, 503, 504],
  fetchImpl: typeof fetch !== "undefined" ? fetch : undefined,
};

/**
 * Default fetch-based client. Adds timeout, retry with exponential backoff, and
 * RFC-7807 problem parsing for robust UX and error messaging.
 */
export function createHttpClient(options: Partial<HttpClientOptions> = {}): HttpClient {
  const opts: HttpClientOptions = { ...defaultOptions, ...options };

  const normalize = (path: string) => {
    if (!path.startsWith("/")) return `${opts.baseUrl}/${path}`;
    return `${opts.baseUrl}${path}`;
  };

  const request = async <T>(input: HttpRequest): Promise<HttpResult<T>> => {
    const url = normalize(input.path);
    const baseHeaders: Record<string, string> = {
      Accept: "application/json",
      ...input.headers,
    };

    const shouldAddContentType = input.body !== undefined && !(typeof input.body === "object" && input.body instanceof FormData);
    if (shouldAddContentType && !baseHeaders["Content-Type"]) {
      baseHeaders["Content-Type"] = "application/json";
    }

    const attempts = opts.retries + 1;
    let lastErr: HttpError | null = null;

    for (let attempt = 0; attempt < attempts; attempt++) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), input.timeoutMs ?? opts.timeoutMs);
      const fetcher = opts.fetchImpl ?? fetch;

      try {
        const res = await fetcher(url, {
          method: input.method ?? "GET",
          headers: baseHeaders,
          body: input.body && shouldAddContentType ? JSON.stringify(input.body) : (input.body as BodyInit | null | undefined),
          signal: input.signal ?? controller.signal,
        });

        clearTimeout(timeout);

        const text = await res.text();
        const body = text ? safeParseJSON(text) : null;

        if (!res.ok) {
          const problem = parseProblem(body, res.headers.get("content-type"));
          const error = new HttpError(`HTTP ${res.status} ${res.statusText}`, res.status, body, problem, { attempt });
          if (shouldRetry(res.status, attempt, opts)) {
            lastErr = error;
            await sleep(backoffMs(attempt, opts.retryBackoffMs));
            continue;
          }
          throw error;
        }

        return {
          data: body as T,
          status: res.status,
          headers: res.headers,
        };
      } catch (err) {
        clearTimeout(timeout);
        const isAbort = err instanceof DOMException && err.name === "AbortError";
        const networkError = new HttpError(
          isAbort ? "Request timed out" : "Network error",
          0,
          null,
          undefined,
          { network: !isAbort, timeout: isAbort, attempt }
        );

        if (err instanceof HttpError) {
          lastErr = err;
        } else if (isAbort || err instanceof TypeError) {
          lastErr = networkError;
        }

        if (attempt < attempts - 1) {
          await sleep(backoffMs(attempt, opts.retryBackoffMs));
          continue;
        }

        throw lastErr ?? networkError;
      }
    }

    throw lastErr ?? new HttpError("Unknown HTTP error", 0, null);
  };

  return { request };
}

function safeParseJSON(payload: string): unknown {
  try {
    return JSON.parse(payload);
  } catch {
    return payload;
  }
}

function parseProblem(body: unknown, contentType: string | null): ProblemDetails | undefined {
  const isProblem = contentType?.includes("application/problem+json");
  if (isProblem && body && typeof body === "object") {
    return body as ProblemDetails;
  }

  if (body && typeof body === "object") {
    const maybe = body as ProblemDetails;
    if (maybe.detail || maybe.title || maybe.status) return maybe;
  }

  return undefined;
}

function shouldRetry(status: number, attempt: number, opts: HttpClientOptions) {
  if (attempt >= opts.retries) return false;
  return opts.retryStatusCodes.includes(status);
}

function backoffMs(attempt: number, base: number) {
  const jitter = Math.floor(Math.random() * 100);
  return base * Math.pow(2, attempt) + jitter;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
