import { ClerkProvider, SignedIn as ClerkSignedIn, SignedOut as ClerkSignedOut } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import type { AuthTokenGetter } from "@api-boilerplate/auth";
import { configureAuthServer, type AuthServerAdapter } from "@api-boilerplate/auth-ui/server";
import { createElement, Fragment, type ReactNode } from "react";
import {
  configureClerkLocalizations,
  resolveClerkLocalization,
  type ClerkLocalization,
} from "./localization";

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim();
const authEnabled = Boolean(clerkKey);

type AuthProviderProps = {
  children?: ReactNode;
} & Record<string, unknown>;

type ProviderProps = Record<string, unknown> & { locale?: string | null; localization?: ClerkLocalization };

function resolveProviderProps(props: Record<string, unknown>) {
  if (!authEnabled) return props;
  const { locale, localization, ...rest } = props as ProviderProps;
  const resolvedLocalization = localization ?? (locale ? resolveClerkLocalization(locale) : undefined);
  if (!resolvedLocalization) return rest;
  return { ...rest, localization: resolvedLocalization };
}

export const clerkAuthServerAdapter: AuthServerAdapter = {
  AuthProvider: (props: AuthProviderProps) => {
    if (!authEnabled) return createElement(Fragment, null, props.children);
    return createElement(ClerkProvider as unknown as (props: AuthProviderProps) => ReactNode, props);
  },
  resolveProviderProps,
  SignedIn: (props: { children?: ReactNode }) => {
    if (!authEnabled) return null;
    return createElement(ClerkSignedIn, props);
  },
  SignedOut: (props: { children?: ReactNode }) => {
    if (!authEnabled) return createElement(Fragment, null, props.children);
    return createElement(ClerkSignedOut, props);
  },
  getAuth: async () => {
    if (!authEnabled) {
      return { userId: null, getToken: async () => null, isEnabled: false };
    }
    const { userId, getToken } = await auth();
    return { userId: userId ?? null, getToken: getToken as AuthTokenGetter, isEnabled: true };
  },
  getCurrentUser: async () => {
    if (!authEnabled) return null;
    return currentUser();
  },
  isAuthEnabled: () => authEnabled,
};

type LocalizationMap = Record<string, ClerkLocalization>;

export function configureClerkAuthServer(localizations: LocalizationMap = {}) {
  configureClerkLocalizations(localizations);
  configureAuthServer(clerkAuthServerAdapter);
}

export { configureClerkLocalizations } from "./localization";
