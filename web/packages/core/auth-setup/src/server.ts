import { configureAuthServer, type AuthServerAdapter } from "@api-boilerplate/auth-ui/server";
import type { LocalizationConfigurator } from "./types";

export function configureAuthServerAdapter<Localizations>(
  adapter: AuthServerAdapter,
  localizations?: Localizations,
  configureLocalizations?: LocalizationConfigurator<Localizations>
) {
  if (localizations && configureLocalizations) {
    configureLocalizations(localizations);
  }
  configureAuthServer(adapter);
}
