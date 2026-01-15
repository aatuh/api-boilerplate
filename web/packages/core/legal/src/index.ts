export { LegalPage } from "./legal-page";
export { mergeLegalDoc } from "./merge";
export { applyLegalTokens } from "./tokens";
export { composeLegalDoc } from "./compose";
export { getVanillaLegalLocales, getVanillaLegalSnippets, getVanillaLegalTemplate } from "./vanilla";
export {
  composeConsentConfig,
  getVanillaConsentConfig,
  getVanillaConsentCategories,
  getVanillaConsentCategory,
  CONSENT_CATEGORY_IDS,
  CONSENT_ENTRY_IDS,
  vanillaConsentEn,
  vanillaConsentFi,
} from "./consent";
export type { LegalTokens } from "./tokens";
export type {
  LegalBlock,
  LegalDoc,
  LegalDocOverride,
  LegalSection,
  LegalSectionOverride,
  LegalSnippet,
  LegalSnippetPlacement,
  LegalTemplate,
} from "./types";
export type {
  ConsentCategory,
  ConsentConfig,
  ConsentEntry,
  ConsentOverrides,
} from "./consent";
