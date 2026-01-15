export type AuthTokenOptions = { template?: string };
export type AuthTokenGetter = (options?: AuthTokenOptions) => Promise<string | null>;

export type AuthSession = {
  isSignedIn?: boolean | null;
  getToken: AuthTokenGetter;
  userId?: string | null;
};

export type AuthTokenOptionsProvider = () => AuthTokenOptions | undefined;

export async function getAuthToken(
  getToken: AuthTokenGetter,
  isSignedIn?: boolean,
  optionsProvider?: AuthTokenOptionsProvider
): Promise<string | null> {
  if (isSignedIn === false) return null;
  return getToken(optionsProvider?.());
}
