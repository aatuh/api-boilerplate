import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { clerkMiddleware } from "@clerk/nextjs/server";
import type { AuthMiddlewareAdapter, AuthContext } from "@api-boilerplate/auth-ui/middleware";
import { createAuthMiddleware } from "@api-boilerplate/auth-ui/middleware";

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim();
const authEnabled = Boolean(clerkKey);

type RedirectOptions = { returnBackUrl?: string };

export const clerkAuthMiddleware: AuthMiddlewareAdapter = (handler) => {
  if (!authEnabled) {
    return async (req: NextRequest) =>
      handler(
        async () => ({
          userId: null,
          redirectToSignIn: () => NextResponse.next(),
          isEnabled: false,
        }),
        req
      );
  }

  return clerkMiddleware(async (auth, req) =>
    handler(async () => {
      const { userId, redirectToSignIn } = await auth();
      const context: AuthContext = {
        userId: userId ?? null,
        redirectToSignIn: (options?: RedirectOptions) => redirectToSignIn(options),
        isEnabled: true,
      };
      return context;
    }, req)
  );
};

export const createClerkAuthMiddleware = () => createAuthMiddleware(clerkAuthMiddleware);
