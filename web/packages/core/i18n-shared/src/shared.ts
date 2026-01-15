export type SharedDictionary = {
  common: {
    actions: {
      save: string;
      cancel: string;
      close: string;
      confirm: string;
      submit: string;
      edit: string;
      delete: string;
    };
    controls: {
      back: string;
      open: string;
      loading: string;
    };
    footer: {
      languageLabel: string;
      languageEnglish: string;
      languageFinnish: string;
      themeLabel: string;
      themeLight: string;
      themeDark: string;
      themeSystem: string;
      themeVariantLabel: string;
    };
    status: {
      success: string;
      error: string;
      saved: string;
      updated: string;
    };
  };
};

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Record<string, unknown> ? DeepPartial<T[K]> : T[K];
};

export const sharedEn: DeepPartial<SharedDictionary> = {
  common: {
    actions: {
      save: "Save",
      cancel: "Cancel",
      close: "Close",
      confirm: "Confirm",
      submit: "Submit",
      edit: "Edit",
      delete: "Delete",
    },
    controls: {
      back: "Back",
      open: "Open",
      loading: "Loading...",
    },
    footer: {
      languageLabel: "Language",
      languageEnglish: "English",
      languageFinnish: "Finnish",
      themeLabel: "Theme",
      themeLight: "Light mode",
      themeDark: "Dark mode",
      themeSystem: "System",
      themeVariantLabel: "Theme variant",
    },
    status: {
      success: "Success",
      error: "Error",
      saved: "Saved",
      updated: "Updated",
    },
  },
};

export const sharedFi: DeepPartial<SharedDictionary> = {
  common: {
    actions: {
      save: "Tallenna",
      cancel: "Peruuta",
      close: "Sulje",
      confirm: "Vahvista",
      submit: "Lähetä",
      edit: "Muokkaa",
      delete: "Poista",
    },
    controls: {
      back: "Takaisin",
      open: "Avaa",
      loading: "Ladataan...",
    },
    footer: {
      languageLabel: "Kieli",
      languageEnglish: "Englanti",
      languageFinnish: "Suomi",
      themeLabel: "Teema",
      themeLight: "Vaalea tila",
      themeDark: "Tumma tila",
      themeSystem: "Järjestelmä",
      themeVariantLabel: "Teemavaihtoehto",
    },
    status: {
      success: "Onnistui",
      error: "Virhe",
      saved: "Tallennettu",
      updated: "Päivitetty",
    },
  },
};
