import type { HttpClient, HttpRequest, HttpResult } from "./client";

export type MockHttpResponse<T = unknown> = Partial<HttpResult<T>> | Error;
export type MockResponder<T = unknown> = (req: HttpRequest) => MockHttpResponse<T> | Promise<MockHttpResponse<T>>;

/**
 * Lightweight mockable HttpClient for unit tests. Provide a responder function
 * that returns either a HttpResult-like object or throws/returns an Error.
 */
export function createMockHttpClient(responder: MockResponder): HttpClient {
  return {
    async request<T>(input: HttpRequest): Promise<HttpResult<T>> {
      const res = await responder(input);
      if (res instanceof Error) throw res;
      const headers = res.headers ?? new Headers();
      const status = res.status ?? 200;
      const data = (res.data ?? {}) as T;
      return { headers, status, data };
    },
  };
}
