"use client";

import type { ComponentType, ReactNode } from "react";
import type { AuthSession, AuthTokenGetter } from "@api-boilerplate/auth";

export type AuthUiComponent = ComponentType<Record<string, unknown>>;

export type AuthUiAdapter = {
  AuthProvider: AuthUiComponent;
  resolveProviderProps?: (props: Record<string, unknown>) => Record<string, unknown>;
  SignedIn: AuthUiComponent;
  SignedOut: AuthUiComponent;
  SignIn: AuthUiComponent;
  SignUp: AuthUiComponent;
  SignInButton: AuthUiComponent;
  UserButton: AuthUiComponent;
  UserMenu: AuthUiComponent;
  useAuth: () => AuthSession;
  getAuthToken: (getToken: AuthTokenGetter, isSignedIn?: boolean | null) => Promise<string | null>;
  isAuthEnabled: () => boolean;
};

const stubAdapter: AuthUiAdapter = {
  AuthProvider: ({ children }: { children?: ReactNode }) => <>{children}</>,
  SignedIn: () => null,
  SignedOut: ({ children }: { children?: ReactNode }) => <>{children}</>,
  SignIn: () => null,
  SignUp: () => null,
  SignInButton: ({ children }: { children?: ReactNode }) => <>{children}</>,
  UserButton: () => null,
  UserMenu: () => null,
  useAuth: () => ({ isSignedIn: false, getToken: async () => null, userId: null }),
  getAuthToken: async () => null,
  isAuthEnabled: () => false,
};

let adapter: AuthUiAdapter = stubAdapter;

export function configureAuthUi(next: Partial<AuthUiAdapter>) {
  adapter = { ...stubAdapter, ...next };
}

function getAdapter() {
  return adapter;
}

export function AuthProvider(props: Record<string, unknown>) {
  const current = getAdapter();
  const Component = current.AuthProvider;
  const resolvedProps = current.resolveProviderProps ? current.resolveProviderProps(props) : props;
  return <Component {...resolvedProps} />;
}

export function SignedIn(props: Record<string, unknown>) {
  const Component = getAdapter().SignedIn;
  return <Component {...props} />;
}

export function SignedOut(props: Record<string, unknown>) {
  const Component = getAdapter().SignedOut;
  return <Component {...props} />;
}

export function SignIn(props: Record<string, unknown>) {
  const Component = getAdapter().SignIn;
  return <Component {...props} />;
}

export function SignUp(props: Record<string, unknown>) {
  const Component = getAdapter().SignUp;
  return <Component {...props} />;
}

export function SignInButton(props: Record<string, unknown>) {
  const Component = getAdapter().SignInButton;
  return <Component {...props} />;
}

export function UserButton(props: Record<string, unknown>) {
  const Component = getAdapter().UserButton;
  return <Component {...props} />;
}

export function UserMenu(props: Record<string, unknown>) {
  const Component = getAdapter().UserMenu;
  return <Component {...props} />;
}

export function useAuth() {
  return getAdapter().useAuth();
}

export function isAuthEnabled() {
  return getAdapter().isAuthEnabled();
}

export function getAuthToken(getToken: AuthTokenGetter, isSignedIn?: boolean | null): Promise<string | null> {
  return getAdapter().getAuthToken(getToken, isSignedIn ?? undefined);
}
