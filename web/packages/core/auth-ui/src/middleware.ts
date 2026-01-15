import type { NextFetchEvent, NextRequest } from "next/server";
import { NextResponse } from "next/server";

type RedirectOptions = { returnBackUrl?: string };

export type AuthContext = {
  userId: string | null;
  redirectToSignIn: (options?: RedirectOptions) => NextResponse;
  isEnabled: boolean;
};

export type AuthHandler = (
  auth: () => Promise<AuthContext>,
  req: NextRequest
) => Response | void | null | Promise<Response | void | null>;
export type AuthMiddlewareAdapter = (
  handler: AuthHandler
) => (req: NextRequest, event: NextFetchEvent) => Response | void | null | Promise<Response | void | null>;

const stubAdapter: AuthMiddlewareAdapter = (handler) => async (req) =>
  handler(
    async () => ({
      userId: null,
      redirectToSignIn: () => NextResponse.next(),
      isEnabled: false,
    }),
    req
  );

export function createAuthMiddleware(adapter?: AuthMiddlewareAdapter) {
  return (handler: AuthHandler) => (adapter ?? stubAdapter)(handler);
}
