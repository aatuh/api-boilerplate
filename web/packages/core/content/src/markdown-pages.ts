import "server-only";

import { cache } from "react";
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import {
  DEFAULT_LOCALE as DEFAULT_I18N_LOCALE,
  SUPPORTED_LOCALES as DEFAULT_I18N_LOCALES,
  normalizeLocale as normalizeLocaleShared,
} from "@api-boilerplate/i18n-shared/config";

type MarkdownStoreConfig = {
  contentRoot?: string;
  defaultLocale?: string;
  supportedLocales?: readonly string[];
  normalizeLocale?: (input?: string | null) => string;
};

const DEFAULT_CONTENT_ROOT = path.join(process.cwd(), "content", "pages");

const actionSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
  variant: z.enum(["primary", "secondary", "ghost"]).optional(),
});

const statsItemSchema = z.object({
  key: z.string().optional(),
  value: z.string().min(1),
  detail: z.string().min(1),
});

const flowItemSchema = z.object({
  label: z.string().min(1),
});

const imageSchema = z.object({
  src: z.string().min(1),
  alt: z.string().min(1),
});

const heroBlockSchema = z.object({
  type: z.literal("hero"),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  actions: z.array(actionSchema).min(1),
  stats: z.array(statsItemSchema).min(1),
  flowTitle: z.string().min(1),
  flowItems: z.array(flowItemSchema).min(1),
  image: imageSchema.optional(),
});

const servicesItemSchema = z.object({
  href: z.string().min(1),
  title: z.string().min(1),
  body: z.string().min(1),
  image: imageSchema.optional(),
});

const servicesBlockSchema = z.object({
  type: z.literal("services"),
  title: z.string().min(1),
  description: z.string().optional(),
  items: z.array(servicesItemSchema).min(1),
});

const locationsItemSchema = z.object({
  slug: z.string().min(1),
  label: z.string().min(1),
});

const locationsBlockSchema = z.object({
  type: z.literal("locations"),
  title: z.string().min(1),
  description: z.string().optional(),
  items: z.array(locationsItemSchema).min(1),
  allLabel: z.string().optional(),
  allHref: z.string().optional(),
});

const companyTeaserBlockSchema = z.object({
  type: z.literal("companyTeaser"),
  title: z.string().min(1),
  description: z.string().min(1),
  cta: actionSchema,
});

const stepsItemSchema = z.object({
  title: z.string().min(1),
  detail: z.string().min(1),
});

const stepsBlockSchema = z.object({
  type: z.literal("steps"),
  stepLabel: z.string().min(1),
  items: z.array(stepsItemSchema).min(1),
  actions: z.array(actionSchema).optional(),
});

const highlightsItemSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
});

const highlightsBlockSchema = z.object({
  type: z.literal("highlights"),
  items: z.array(highlightsItemSchema).min(1),
});

const twoColumnBlockSchema = z.object({
  type: z.literal("twoColumn"),
  left: z.object({
    label: z.string().min(1),
    title: z.string().min(1),
    steps: z.array(stepsItemSchema).min(1),
  }),
  right: z.object({
    label: z.string().min(1),
    title: z.string().min(1),
    items: z.array(highlightsItemSchema).min(1),
  }),
});

const audienceSchema = z.object({
  label: z.string().min(1),
  title: z.string().min(1),
  body: z.string().min(1),
  bullets: z.array(z.string().min(1)).min(1),
  cta: actionSchema,
});

const audiencesBlockSchema = z.object({
  type: z.literal("audiences"),
  consumer: audienceSchema,
  company: audienceSchema,
});

const faqItemSchema = z.object({
  q: z.string().min(1),
  a: z.string().min(1),
});

const faqBlockSchema = z.object({
  type: z.literal("faq"),
  title: z.string().min(1),
  items: z.array(faqItemSchema).min(1),
});

const markdownBlockSchema = z.object({
  type: z.literal("markdown"),
  title: z.string().optional(),
  content: z.string().min(1),
});

const blockSchema = z.discriminatedUnion("type", [
  heroBlockSchema,
  servicesBlockSchema,
  locationsBlockSchema,
  companyTeaserBlockSchema,
  highlightsBlockSchema,
  twoColumnBlockSchema,
  audiencesBlockSchema,
  stepsBlockSchema,
  faqBlockSchema,
  markdownBlockSchema,
]);

const frontmatterSchema = z.object({
  layout: z.enum(["default", "info", "marketing"]).optional(),
  backHref: z.string().optional(),
  backLabel: z.string().optional(),
  title: z.string().min(1),
  description: z.string().optional(),
  eyebrow: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  actions: z.array(actionSchema).optional(),
  index: z.boolean().optional(),
  blocks: z.array(blockSchema).optional(),
});

export type MarkdownPageAction = z.infer<typeof actionSchema>;
export type MarkdownPageBlock = z.infer<typeof blockSchema>;
export type MarkdownPageFrontmatter = z.infer<typeof frontmatterSchema>;

export type MarkdownPage = {
  slug: string;
  locale: string;
  frontmatter: MarkdownPageFrontmatter;
  content: string;
};

export type MarkdownPageStore = {
  getMarkdownPage: (slug: string, localeInput: string) => Promise<MarkdownPage>;
  listMarkdownSlugs: () => Promise<string[]>;
  listMarkdownChildren: (prefix: string) => Promise<string[]>;
};

function isSafeSlug(slug: string) {
  const trimmed = slug.trim().replace(/^\/+/, "").replace(/\/+$/, "");
  if (!trimmed) return false;
  const segments = trimmed.split("/");
  return segments.every((segment) => /^[a-z0-9-]+$/.test(segment));
}

async function readMarkdownFile(filePath: string): Promise<string | null> {
  try {
    return await fs.readFile(filePath, "utf8");
  } catch (err) {
    if (err && typeof err === "object" && "code" in err && err.code === "ENOENT") {
      return null;
    }
    throw err;
  }
}

async function listFilesRecursive(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...(await listFilesRecursive(fullPath)));
      } else {
        files.push(fullPath);
      }
    })
  );
  return files;
}

export function createMarkdownPageStore(config: MarkdownStoreConfig = {}): MarkdownPageStore {
  const contentRoot = config.contentRoot ?? DEFAULT_CONTENT_ROOT;
  const defaultLocale = (config.defaultLocale ?? DEFAULT_I18N_LOCALE).toLowerCase();
  const supportedLocalesRaw = config.supportedLocales?.length
    ? Array.from(config.supportedLocales)
    : Array.from(DEFAULT_I18N_LOCALES);
  const supportedLocales = supportedLocalesRaw.includes(defaultLocale)
    ? supportedLocalesRaw
    : [...supportedLocalesRaw, defaultLocale];
  const normalizeLocale =
    config.normalizeLocale ??
    ((input?: string | null) => normalizeLocaleShared(input, defaultLocale, supportedLocales));

  const resolveCandidateLocales = (locale: string): string[] => {
    const candidates = [locale, defaultLocale];
    const fallback = supportedLocales.includes("en") ? "en" : null;
    if (fallback) candidates.push(fallback);
    return Array.from(new Set(candidates));
  };

  const loadMarkdownPageRaw = async (slug: string, locale: string) => {
    const candidates = resolveCandidateLocales(locale);
    for (const candidate of candidates) {
      const filePath = path.join(contentRoot, `${slug}.${candidate}.md`);
      const raw = await readMarkdownFile(filePath);
      if (raw !== null) return { raw, locale: candidate };
    }
    return null;
  };

  const getMarkdownPage = cache(async (slug: string, localeInput: string): Promise<MarkdownPage> => {
    if (!isSafeSlug(slug)) {
      throw new Error(`[content] Invalid markdown slug "${slug}".`);
    }
    const normalized = normalizeLocale(localeInput);
    const loaded = await loadMarkdownPageRaw(slug, normalized);
    if (!loaded) {
      throw new Error(`[content] Missing markdown page "${slug}" for locale "${normalized}".`);
    }
    const parsed = matter(loaded.raw);
    const frontmatter = frontmatterSchema.parse(parsed.data);
    return {
      slug,
      locale: loaded.locale,
      frontmatter,
      content: parsed.content.trim(),
    };
  });

  const listMarkdownSlugs = cache(async (): Promise<string[]> => {
    const localePattern = new RegExp(`\\.(${supportedLocales.join("|")})\\.md$`);
    const files = await listFilesRecursive(contentRoot);
    const slugs = files
      .map((filePath) => path.relative(contentRoot, filePath))
      .map((relative) => relative.split(path.sep).join("/"))
      .filter((relative) => localePattern.test(relative))
      .map((relative) => relative.replace(localePattern, ""))
      .filter((slug) => isSafeSlug(slug));
    return Array.from(new Set(slugs)).sort();
  });

  const listMarkdownChildren = cache(async (prefix: string): Promise<string[]> => {
    if (!isSafeSlug(prefix)) return [];
    const dirPath = path.join(contentRoot, prefix);
    const localePattern = new RegExp(`\\.(${supportedLocales.join("|")})\\.md$`);
    let entries: string[] = [];
    try {
      const dirEntries = await fs.readdir(dirPath, { withFileTypes: true });
      entries = dirEntries
        .filter((entry) => entry.isFile() && localePattern.test(entry.name))
        .map((entry) => entry.name.replace(localePattern, ""))
        .filter((name) => /^[a-z0-9-]+$/.test(name));
    } catch (err) {
      if (err && typeof err === "object" && "code" in err && err.code === "ENOENT") {
        return [];
      }
      throw err;
    }
    return Array.from(new Set(entries)).sort();
  });

  return { getMarkdownPage, listMarkdownSlugs, listMarkdownChildren };
}

const defaultStore = createMarkdownPageStore();

export const getMarkdownPage = defaultStore.getMarkdownPage;
export const listMarkdownSlugs = defaultStore.listMarkdownSlugs;
export const listMarkdownChildren = defaultStore.listMarkdownChildren;
