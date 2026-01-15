import { useAuth as useClerkAuth } from "@clerk/nextjs";
import { getAuthToken as resolveAuthToken, type AuthSession, type AuthTokenGetter } from "@api-boilerplate/auth";
import { createClientEnv } from "@api-boilerplate/env";
import { z } from "zod";

const env = createClientEnv(
  {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().optional().default(""),
    NEXT_PUBLIC_CLERK_JWT_TEMPLATE: z.string().optional().default(""),
  },
  {
    runtimeEnv: {
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
      NEXT_PUBLIC_CLERK_JWT_TEMPLATE: process.env.NEXT_PUBLIC_CLERK_JWT_TEMPLATE,
    },
  }
);

const clerkPublishableKey = env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const clerkJwtTemplate = env.NEXT_PUBLIC_CLERK_JWT_TEMPLATE;

export const clerkEnv = {
  publishableKey: clerkPublishableKey,
  jwtTemplate: clerkJwtTemplate,
};

export type ClerkTokenGetter = AuthTokenGetter;

export function useAuth(): AuthSession {
  const { isSignedIn, getToken, userId } = useClerkAuth();
  return { isSignedIn, getToken, userId };
}

export function isClerkEnabled(): boolean {
  return Boolean(clerkPublishableKey);
}

export function getClerkJwtTemplate(): string | undefined {
  return clerkJwtTemplate || undefined;
}

export function getClerkTokenOptions(): { template: string } | undefined {
  const template = getClerkJwtTemplate();
  return template ? { template } : undefined;
}

export async function getAuthToken(getToken: ClerkTokenGetter, isSignedIn?: boolean | null): Promise<string | null> {
  return resolveAuthToken(getToken, isSignedIn ?? undefined, getClerkTokenOptions);
}

export { UserMenu } from "./user-menu";
