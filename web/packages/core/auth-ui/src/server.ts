import type { ComponentType, ReactNode } from "react";
import { createElement, Fragment } from "react";
import type { AuthTokenGetter } from "@api-boilerplate/auth";

export type ServerAuth = {
  userId: string | null;
  getToken: AuthTokenGetter;
  isEnabled: boolean;
};

export type AuthServerAdapter = {
  AuthProvider: ComponentType<Record<string, unknown>>;
  resolveProviderProps?: (props: Record<string, unknown>) => Record<string, unknown>;
  SignedIn: ComponentType<Record<string, unknown>>;
  SignedOut: ComponentType<Record<string, unknown>>;
  getAuth: () => Promise<ServerAuth>;
  getCurrentUser: () => Promise<unknown | null>;
  isAuthEnabled: () => boolean;
};

const stubAdapter: AuthServerAdapter = {
  AuthProvider: ({ children }: { children?: ReactNode }) => createElement(Fragment, null, children),
  SignedIn: () => null,
  SignedOut: ({ children }: { children?: ReactNode }) => createElement(Fragment, null, children),
  getAuth: async () => ({ userId: null, getToken: async () => null, isEnabled: false }),
  getCurrentUser: async () => null,
  isAuthEnabled: () => false,
};

let adapter: AuthServerAdapter = stubAdapter;

export function configureAuthServer(next: Partial<AuthServerAdapter>) {
  adapter = { ...stubAdapter, ...next };
}

function getAdapter() {
  return adapter;
}

export function AuthProvider(props: Record<string, unknown>) {
  const current = getAdapter();
  const Component = current.AuthProvider;
  const resolvedProps = current.resolveProviderProps ? current.resolveProviderProps(props) : props;
  return createElement(Component, resolvedProps);
}

export function SignedIn(props: Record<string, unknown>) {
  const Component = getAdapter().SignedIn;
  return createElement(Component, props);
}

export function SignedOut(props: Record<string, unknown>) {
  const Component = getAdapter().SignedOut;
  return createElement(Component, props);
}

export function getAuth() {
  return getAdapter().getAuth();
}

export function getCurrentUser() {
  return getAdapter().getCurrentUser();
}

export function isAuthEnabled() {
  return getAdapter().isAuthEnabled();
}
