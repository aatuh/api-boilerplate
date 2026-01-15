import type { LegalDoc, LegalDocOverride, LegalSection, LegalSectionOverride } from "./types";

function mergeSections(baseSections: LegalSection[], overrides?: LegalSectionOverride[]): LegalSection[] {
  if (!overrides || overrides.length === 0) return baseSections;

  const overrideMap = new Map(overrides.map((section) => [section.id, section]));
  const merged = baseSections.map((section) => {
    const override = overrideMap.get(section.id);
    if (!override) return section;
    return {
      ...section,
      ...override,
      blocks: override.blocks ?? section.blocks,
    };
  });

  const appended = overrides
    .filter((section) => !baseSections.some((base) => base.id === section.id))
    .map((section) => ({
      id: section.id,
      title: section.title ?? section.id,
      blocks: section.blocks ?? [],
    }));

  return [...merged, ...appended];
}

export function mergeLegalDoc(base: LegalDoc, override?: LegalDocOverride): LegalDoc {
  if (!override) return base;

  return {
    ...base,
    ...override,
    sections: mergeSections(base.sections, override.sections),
  };
}
