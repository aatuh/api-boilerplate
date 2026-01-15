import { applyLegalTokens } from "./tokens";
import type { LegalTokens } from "./tokens";
import { mergeLegalDoc } from "./merge";
import type {
  LegalDoc,
  LegalDocOverride,
  LegalSnippet,
  LegalSnippetPlacement,
  LegalTemplate,
} from "./types";

export type LegalCompositionOptions = {
  template: LegalTemplate;
  snippets?: Record<string, LegalSnippet>;
  include?: LegalSnippetPlacement[];
  omit?: string[];
  override?: LegalDocOverride;
  tokens?: LegalTokens;
};

type TableRowInjection = {
  tableId: string;
  rows: string[][];
};

function appendTableRows(doc: LegalDoc, injections: TableRowInjection[]) {
  if (injections.length === 0) return doc;

  const injectionMap = new Map<string, string[][]>();
  injections.forEach((injection) => {
    const existing = injectionMap.get(injection.tableId) ?? [];
    injectionMap.set(injection.tableId, [...existing, ...injection.rows]);
  });

  return {
    ...doc,
    sections: doc.sections.map((section) => ({
      ...section,
      blocks: section.blocks
        .map((block) => {
          if (block.type !== "table" || !block.id) return block;
          const rows = injectionMap.get(block.id);
          if (!rows || rows.length === 0) return block;
          return {
            ...block,
            rows: [...block.rows, ...rows],
          };
        })
        .filter((block) => (block.type === "table" ? block.rows.length > 0 : true)),
    })),
  };
}

function addSnippet(
  snippet: LegalSnippet,
  blocks: LegalDoc["sections"][number]["blocks"],
  tableRows: TableRowInjection[],
  position: "start" | "end"
) {
  if ("blocks" in snippet) {
    if (position === "start") {
      blocks.unshift(...snippet.blocks);
    } else {
      blocks.push(...snippet.blocks);
    }
    return;
  }

  tableRows.push({
    tableId: snippet.tableRows.tableId,
    rows: snippet.tableRows.rows,
  });
}

export function composeLegalDoc({
  template,
  snippets = {},
  include = [],
  omit = [],
  override,
  tokens,
}: LegalCompositionOptions): LegalDoc {
  const omitted = new Set(omit);
  const tableRows: TableRowInjection[] = [];

  const doc: LegalDoc = {
    slug: template.slug,
    title: template.title,
    summary: template.summary,
    eyebrow: template.eyebrow,
    tocLabel: template.tocLabel,
    updatedLabel: template.updatedLabel,
    updatedAt: template.updatedAt,
    sections: [],
  };

  template.sections.forEach((section) => {
    if (omitted.has(section.id)) return;

    const blocks = [...(section.blocks ?? [])];
    const snippetIds = section.snippetIds ?? [];

    snippetIds.forEach((snippetId) => {
      if (omitted.has(snippetId)) return;
      const snippet = snippets[snippetId];
      if (!snippet) {
        if (process.env.NODE_ENV !== "production") {
          console.warn(`[legal] Missing snippet "${snippetId}".`);
        }
        return;
      }
      addSnippet(snippet, blocks, tableRows, "end");
    });

    doc.sections.push({
      id: section.id,
      title: section.title,
      blocks,
    });
  });

  include.forEach((placement) => {
    if (omitted.has(placement.snippetId)) return;
    const snippet = snippets[placement.snippetId];
    if (!snippet) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(`[legal] Missing snippet "${placement.snippetId}".`);
      }
      return;
    }

    const target = doc.sections.find((section) => section.id === placement.sectionId);
    if (!target) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(`[legal] Missing section "${placement.sectionId}" for snippet "${placement.snippetId}".`);
      }
      return;
    }

    addSnippet(snippet, target.blocks, tableRows, placement.position ?? "end");
  });

  const merged = override ? mergeLegalDoc(doc, override) : doc;
  const withTableRows = appendTableRows(merged, tableRows);
  return tokens ? applyLegalTokens(withTableRows, tokens) : withTableRows;
}
