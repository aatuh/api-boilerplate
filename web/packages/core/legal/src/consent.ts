import type { LegalTokens } from "./tokens";

export type ConsentEntry = {
  id: string;
  label: string;
  description?: string;
  cookies?: string[];
  required?: boolean;
  defaultState?: "on" | "off";
};

export type ConsentCategory = {
  id: string;
  title: string;
  description?: string;
  required?: boolean;
  entries: ConsentEntry[];
};

export type ConsentConfig = ConsentCategory[];

export type ConsentOverrides = {
  appendEntries?: Record<string, ConsentEntry[]>;
  updateCategories?: Record<
    string,
    Partial<Omit<ConsentCategory, "id" | "entries">> & {
      entries?: ConsentEntry[];
    }
  >;
  omitCategories?: string[];
  replaceCategories?: ConsentCategory[];
};

export const CONSENT_CATEGORY_IDS = {
  NECESSARY: "necessary",
  PREFERENCES: "preferences",
  ANALYTICS: "analytics",
  ADVERTISING: "advertising",
  SOCIAL: "social",
} as const;

export const CONSENT_ENTRY_IDS = {
  SESSION: "session",
  PAYMENTS: "payments",
  UI_PREFERENCES: "ui-preferences",
  PLAUSIBLE: "plausible",
  UMAMI: "umami",
  GOOGLE_ADS: "google-ads",
  META: "meta",
  LINKEDIN: "linkedin",
} as const;

function replaceTokens(
  value: string | undefined,
  tokens?: LegalTokens
): string | undefined {
  if (!value || !tokens) return value;
  return value.replace(
    /\{\{([A-Z0-9_]+)\}\}/g,
    (match, key) => tokens[key] ?? match
  );
}

function applyTokens(
  config: ConsentConfig,
  tokens?: LegalTokens
): ConsentConfig {
  if (!tokens) return config;
  return config.map((category) => ({
    ...category,
    title: replaceTokens(category.title, tokens) ?? category.title,
    description: replaceTokens(category.description, tokens),
    entries: category.entries.map((entry) => ({
      ...entry,
      label: replaceTokens(entry.label, tokens) ?? entry.label,
      description: replaceTokens(entry.description, tokens),
      cookies: entry.cookies?.map(
        (cookie) => replaceTokens(cookie, tokens) ?? cookie
      ),
    })),
  }));
}

export function composeConsentConfig(
  template: ConsentConfig,
  overrides?: ConsentOverrides,
  tokens?: LegalTokens
): ConsentConfig {
  if (overrides?.replaceCategories) {
    return applyTokens(overrides.replaceCategories, tokens);
  }

  const omitted = new Set(overrides?.omitCategories ?? []);

  const cloned = template
    .filter((category) => !omitted.has(category.id))
    .map((category) => ({
      ...category,
      entries: category.entries.map((entry) => ({ ...entry })),
    }));

  const appendEntries = overrides?.appendEntries ?? {};
  const updates = overrides?.updateCategories ?? {};

  const merged = cloned.map((category) => {
    const extra = appendEntries[category.id] ?? [];
    const update = updates[category.id] ?? {};
    const replacedEntries = update.entries;
    return {
      ...category,
      ...update,
      entries: replacedEntries
        ? [...replacedEntries, ...extra]
        : [...category.entries, ...extra],
    };
  });

  return applyTokens(merged, tokens);
}

export const vanillaConsentEn: ConsentConfig = [
  {
    id: CONSENT_CATEGORY_IDS.NECESSARY,
    title: "Strictly necessary",
    description:
      "Required for security, login, payments, and site stability. Always on.",
    required: true,
    entries: [
      {
        id: CONSENT_ENTRY_IDS.SESSION,
        label: "Authentication & sessions",
        description: "Keeps you signed in and protects your account.",
        cookies: ["__client*", "__clerk*", "clerk*", "__session", "__refresh*"],
        required: true,
        defaultState: "on",
      },
      {
        id: CONSENT_ENTRY_IDS.PAYMENTS,
        label: "Payments ({{PAYMENTS_PROVIDER}})",
        description: "Checkout and load-balancing for secure payments.",
        cookies: ["__stripe*"],
        required: true,
        defaultState: "on",
      },
    ],
  },
  {
    id: CONSENT_CATEGORY_IDS.PREFERENCES,
    title: "Preferences",
    description: "Remember your UI choices, such as theme or language.",
    entries: [
      {
        id: CONSENT_ENTRY_IDS.UI_PREFERENCES,
        label: "Theme and locale",
        description: "Saves light/dark mode and language preferences.",
        cookies: ["cookie_preferences", "theme", "locale"],
        defaultState: "off",
      },
    ],
  },
  {
    id: CONSENT_CATEGORY_IDS.ANALYTICS,
    title: "Analytics",
    description: "Help us understand usage to improve the product.",
    entries: [
      {
        id: CONSENT_ENTRY_IDS.PLAUSIBLE,
        label: "Plausible Analytics",
        description: "Lightweight, privacy-friendly analytics.",
        cookies: ["_plausible*"],
        defaultState: "off",
      },
      {
        id: CONSENT_ENTRY_IDS.UMAMI,
        label: "Umami Analytics",
        description: "Lightweight analytics; can run cookie-less.",
        cookies: ["umami_*"],
        defaultState: "off",
      },
    ],
  },
  {
    id: CONSENT_CATEGORY_IDS.ADVERTISING,
    title: "Advertising",
    description: "Personalised ads and attribution (only if enabled).",
    entries: [
      {
        id: CONSENT_ENTRY_IDS.GOOGLE_ADS,
        label: "Google Ads (Consent Mode v2)",
        description: "Personalised ads and attribution for Google Ads.",
        cookies: ["_gads", "_gcl_au", "_fbp"],
        defaultState: "off",
      },
    ],
  },
  {
    id: CONSENT_CATEGORY_IDS.SOCIAL,
    title: "Social & pixels",
    description: "Measure social campaigns and conversions (only if enabled).",
    entries: [
      {
        id: CONSENT_ENTRY_IDS.META,
        label: "Meta Pixel",
        description: "Social campaign measurement.",
        cookies: ["fr"],
        defaultState: "off",
      },
      {
        id: CONSENT_ENTRY_IDS.LINKEDIN,
        label: "LinkedIn Insight Tag",
        description: "Social campaign measurement.",
        cookies: ["bcookie", "li_gc"],
        defaultState: "off",
      },
    ],
  },
];

export const vanillaConsentFi: ConsentConfig = [
  {
    id: CONSENT_CATEGORY_IDS.NECESSARY,
    title: "Välttämättömät",
    description:
      "Turvallisuus, kirjautuminen, maksut ja sivuston vakaus. Aina päällä.",
    required: true,
    entries: [
      {
        id: CONSENT_ENTRY_IDS.SESSION,
        label: "Autentikointi ja istunnot",
        description: "Pitää sinut kirjautuneena ja suojaa tiliäsi.",
        cookies: ["__client*", "__clerk*", "clerk*", "__session", "__refresh*"],
        required: true,
        defaultState: "on",
      },
      {
        id: CONSENT_ENTRY_IDS.PAYMENTS,
        label: "Maksut ({{PAYMENTS_PROVIDER}})",
        description:
          "Kassa ja kuormantasauksen evästeet turvallisiin maksuihin.",
        cookies: ["__stripe*"],
        required: true,
        defaultState: "on",
      },
    ],
  },
  {
    id: CONSENT_CATEGORY_IDS.PREFERENCES,
    title: "Asetukset",
    description: "Tallentaa käyttöliittymävalinnat, kuten teeman ja kielen.",
    entries: [
      {
        id: CONSENT_ENTRY_IDS.UI_PREFERENCES,
        label: "Teema ja kieli",
        description: "Tallentaa vaalea/tumma-tilan ja kieliasetukset.",
        cookies: ["cookie_preferences", "theme", "locale"],
        defaultState: "off",
      },
    ],
  },
  {
    id: CONSENT_CATEGORY_IDS.ANALYTICS,
    title: "Analytiikka",
    description: "Auttaa ymmärtämään käyttöä ja parantamaan palvelua.",
    entries: [
      {
        id: CONSENT_ENTRY_IDS.PLAUSIBLE,
        label: "Plausible Analytics",
        description: "Kevyt ja tietosuojaystävällinen analytiikka.",
        cookies: ["_plausible*"],
        defaultState: "off",
      },
      {
        id: CONSENT_ENTRY_IDS.UMAMI,
        label: "Umami Analytics",
        description: "Kevyt analytiikka; voi toimia ilman evästeitä.",
        cookies: ["umami_*"],
        defaultState: "off",
      },
    ],
  },
  {
    id: CONSENT_CATEGORY_IDS.ADVERTISING,
    title: "Mainonta",
    description: "Personoidut mainokset ja attribuutio (vain jos käytössä).",
    entries: [
      {
        id: CONSENT_ENTRY_IDS.GOOGLE_ADS,
        label: "Google Ads (Consent Mode v2)",
        description: "Personoidut mainokset ja attribuutio Google Adsiin.",
        cookies: ["_gads", "_gcl_au", "_fbp"],
        defaultState: "off",
      },
    ],
  },
  {
    id: CONSENT_CATEGORY_IDS.SOCIAL,
    title: "Sosiaaliset ja pikselit",
    description: "Sosiaalisten kampanjoiden mittaus (vain jos käytössä).",
    entries: [
      {
        id: CONSENT_ENTRY_IDS.META,
        label: "Meta Pixel",
        description: "Sosiaalisten kampanjoiden mittaus.",
        cookies: ["fr"],
        defaultState: "off",
      },
      {
        id: CONSENT_ENTRY_IDS.LINKEDIN,
        label: "LinkedIn Insight Tag",
        description: "Sosiaalisten kampanjoiden mittaus.",
        cookies: ["bcookie", "li_gc"],
        defaultState: "off",
      },
    ],
  },
];

const vanillaConsentByLocale: Record<string, ConsentConfig> = {
  en: vanillaConsentEn,
  fi: vanillaConsentFi,
};

function cloneCategory(category: ConsentCategory): ConsentCategory {
  return {
    ...category,
    entries: category.entries.map((entry) => ({
      ...entry,
      cookies: entry.cookies ? [...entry.cookies] : undefined,
    })),
  };
}

export function getVanillaConsentConfig(locale: string): ConsentConfig {
  return (vanillaConsentByLocale[locale] ?? vanillaConsentEn).map((category) =>
    cloneCategory(category)
  );
}

export function getVanillaConsentCategories(locale: string): ConsentCategory[] {
  return getVanillaConsentConfig(locale);
}

export function getVanillaConsentCategory(
  locale: string,
  id: string
): ConsentCategory | undefined {
  const categories = vanillaConsentByLocale[locale] ?? vanillaConsentEn;
  const match = categories.find((category) => category.id === id);
  return match ? cloneCategory(match) : undefined;
}
