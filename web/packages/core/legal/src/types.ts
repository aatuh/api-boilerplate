type LegalBlockBase = {
  id?: string;
};

export type LegalBlock =
  | (LegalBlockBase & { type: "paragraph"; text: string })
  | (LegalBlockBase & { type: "list"; items: string[] })
  | (LegalBlockBase & { type: "note"; text: string })
  | (LegalBlockBase & { type: "table"; headers: string[]; rows: string[][]; caption?: string });

export type LegalSection = {
  id: string;
  title: string;
  blocks: LegalBlock[];
};

export type LegalDoc = {
  slug: string;
  title: string;
  summary?: string;
  eyebrow?: string;
  tocLabel?: string;
  updatedLabel?: string;
  updatedAt?: string;
  sections: LegalSection[];
};

export type LegalSectionOverride = Partial<Omit<LegalSection, "id">> & { id: string };

export type LegalDocOverride = Partial<Omit<LegalDoc, "sections">> & {
  sections?: LegalSectionOverride[];
};

export type LegalSnippet =
  | { id: string; blocks: LegalBlock[] }
  | { id: string; tableRows: { tableId: string; rows: string[][] } };

export type LegalTemplateSection = {
  id: string;
  title: string;
  blocks?: LegalBlock[];
  snippetIds?: string[];
};

export type LegalTemplate = {
  slug: string;
  title: string;
  summary?: string;
  eyebrow?: string;
  tocLabel?: string;
  updatedLabel?: string;
  updatedAt?: string;
  sections: LegalTemplateSection[];
};

export type LegalSnippetPlacement = {
  sectionId: string;
  snippetId: string;
  position?: "start" | "end";
};
