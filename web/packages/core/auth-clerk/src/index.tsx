"use client";

import type { ComponentProps, ReactNode } from "react";
import {
  ClerkProvider,
  SignedIn as ClerkSignedIn,
  SignedOut as ClerkSignedOut,
  SignIn as ClerkSignIn,
  SignUp as ClerkSignUp,
  SignInButton as ClerkSignInButton,
  UserButton as ClerkUserButton,
} from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import type { AuthSession, AuthTokenGetter } from "@api-boilerplate/auth";
import {
  configureAuthUi,
  type AuthUiAdapter,
  type AuthUiComponent,
} from "@api-boilerplate/auth-ui";
import { useResolvedTheme } from "@api-boilerplate/theme";
import { getAuthToken as getClerkAuthToken, isClerkEnabled, useAuth as useClerkAuth, UserMenu as ClerkUserMenu } from "@api-boilerplate/clerk";
import {
  configureClerkLocalizations,
  resolveClerkLocalization,
  type ClerkLocalization,
} from "./localization";

type SignInProps = ComponentProps<typeof ClerkSignIn>;
type SignUpProps = ComponentProps<typeof ClerkSignUp>;
type AnyProps = Record<string, unknown> & { children?: ReactNode };
type ProviderProps = Record<string, unknown> & { locale?: string | null; localization?: ClerkLocalization };

const authEnabled = isClerkEnabled();

function StubProvider({ children }: AnyProps) {
  return <>{children}</>;
}

function StubSignedIn(props: AnyProps) {
  void props;
  return null;
}

function StubSignedOut({ children }: AnyProps) {
  return <>{children}</>;
}

function StubSignIn(props: AnyProps) {
  void props;
  return null;
}

function StubSignUp(props: AnyProps) {
  void props;
  return null;
}

function StubSignInButton({ children }: AnyProps) {
  return <>{children}</>;
}

function StubUserButton(props: AnyProps) {
  void props;
  return null;
}

function StubUserMenu() {
  return null;
}

function useClerkAppearance(appearance: SignInProps["appearance"]) {
  const resolvedTheme = useResolvedTheme();
  const baseTheme = resolvedTheme === "dark" ? dark : undefined;
  if (!appearance && !baseTheme) return appearance;
  return { ...appearance, baseTheme: appearance?.baseTheme ?? baseTheme };
}

function ClerkSignInWrapper(props: SignInProps) {
  return <ClerkSignIn {...props} appearance={useClerkAppearance(props.appearance)} />;
}

function ClerkSignUpWrapper(props: SignUpProps) {
  return <ClerkSignUp {...props} appearance={useClerkAppearance(props.appearance)} />;
}

function useClerkAuthAdapter(): AuthSession {
  const { isSignedIn, getToken, userId } = useClerkAuth();
  return { isSignedIn, getToken, userId };
}

function useStubAuth(): AuthSession {
  return { isSignedIn: false, getToken: async () => null, userId: null };
}

function asAuthComponent<P>(Component: React.ComponentType<P>): AuthUiComponent {
  return Component as unknown as AuthUiComponent;
}

function resolveProviderProps(props: Record<string, unknown>) {
  if (!authEnabled) return props;
  const { locale, localization, ...rest } = props as ProviderProps;
  const resolvedLocalization = localization ?? (locale ? resolveClerkLocalization(locale) : undefined);
  if (!resolvedLocalization) return rest;
  return { ...rest, localization: resolvedLocalization };
}

export const clerkAuthUiAdapter: AuthUiAdapter = {
  AuthProvider: authEnabled ? asAuthComponent(ClerkProvider) : StubProvider,
  resolveProviderProps,
  SignedIn: authEnabled ? asAuthComponent(ClerkSignedIn) : StubSignedIn,
  SignedOut: authEnabled ? asAuthComponent(ClerkSignedOut) : StubSignedOut,
  SignIn: authEnabled ? asAuthComponent(ClerkSignInWrapper) : StubSignIn,
  SignUp: authEnabled ? asAuthComponent(ClerkSignUpWrapper) : StubSignUp,
  SignInButton: authEnabled ? asAuthComponent(ClerkSignInButton) : StubSignInButton,
  UserButton: authEnabled ? asAuthComponent(ClerkUserButton) : StubUserButton,
  UserMenu: authEnabled ? asAuthComponent(ClerkUserMenu) : StubUserMenu,
  useAuth: authEnabled ? useClerkAuthAdapter : useStubAuth,
  getAuthToken: async (getToken: AuthTokenGetter, isSignedIn?: boolean | null) => {
    if (!authEnabled) return null;
    return getClerkAuthToken(getToken, isSignedIn ?? undefined);
  },
  isAuthEnabled: () => authEnabled,
};

type LocalizationMap = Record<string, ClerkLocalization>;

export function configureClerkAuthUi(localizations: LocalizationMap = {}) {
  configureClerkLocalizations(localizations);
  configureAuthUi(clerkAuthUiAdapter);
}

export { configureClerkLocalizations } from "./localization";
