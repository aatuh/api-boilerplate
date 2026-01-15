export type ThemeVariantName = string;

export type ThemeVariant = {
  name: ThemeVariantName;
  label: string;
};

export const DEFAULT_THEME_VARIANTS: ThemeVariant[] = [
  { name: "slate", label: "Slate" },
  { name: "sunrise", label: "Sunrise" },
];

export const DEFAULT_THEME_VARIANT: ThemeVariantName =
  DEFAULT_THEME_VARIANTS[0]?.name ?? "default";

export const THEME_VARIANTS = DEFAULT_THEME_VARIANTS;
