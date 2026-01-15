"use client";

import { configureAuthUi, type AuthUiAdapter } from "@api-boilerplate/auth-ui";
import type { LocalizationConfigurator } from "./types";

export function configureAuthUiAdapter<Localizations>(
  adapter: AuthUiAdapter,
  localizations?: Localizations,
  configureLocalizations?: LocalizationConfigurator<Localizations>
) {
  if (localizations && configureLocalizations) {
    configureLocalizations(localizations);
  }
  configureAuthUi(adapter);
}
