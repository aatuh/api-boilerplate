import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarketingPage, InfoPage } from "@api-boilerplate/layouts";
import { Button, Card, SectionHeader } from "@api-boilerplate/ui";
import {
  getMarkdownPage,
  type MarkdownPage,
  type MarkdownPageAction,
  type MarkdownPageBlock,
} from "./markdown-pages";
import { MarkdownContent } from "./markdown-content";

export type MarkdownPageProps = {
  slug: string;
  locale: string;
  notFoundOnMissing?: boolean;
  getPage?: (slug: string, locale: string) => Promise<MarkdownPage>;
  localePrefixes?: readonly string[];
};

function isLocalePrefixedPath(href: string, localePrefixes?: readonly string[]) {
  if (!href.startsWith("/")) return false;
  const segment = href.split("/")[1]?.toLowerCase() ?? "";
  if (!segment) return false;
  if (localePrefixes && localePrefixes.length > 0) {
    return localePrefixes.some((prefix) => prefix.toLowerCase() === segment);
  }
  return /^[a-z]{2}$/.test(segment);
}

function localizeHref(href: string, locale: string, localePrefixes?: readonly string[]): string {
  if (!href) return href;
  if (href.startsWith("#")) return href;
  if (!href.startsWith("/")) return href;
  const normalizedLocale = locale.trim().toLowerCase();
  if (!normalizedLocale) return href;
  if (href === "/") return `/${normalizedLocale}`;
  if (href === `/${normalizedLocale}` || href.startsWith(`/${normalizedLocale}/`)) return href;
  if (isLocalePrefixedPath(href, localePrefixes)) return href;
  return `/${normalizedLocale}${href}`;
}

export async function MarkdownPage({
  slug,
  locale,
  notFoundOnMissing,
  getPage = getMarkdownPage,
  localePrefixes,
}: MarkdownPageProps) {
  let page: MarkdownPage;
  try {
    page = await getPage(slug, locale);
  } catch (err) {
    if (notFoundOnMissing) notFound();
    throw err;
  }

  const blocks = page.frontmatter.blocks ?? [];
  const renderedBlocks = [...blocks];
  if (page.content && !blocks.some((block) => block.type === "markdown")) {
    renderedBlocks.push({
      type: "markdown",
      content: page.content,
    });
  }

  const layout = page.frontmatter.layout ?? "default";

  if (layout === "marketing") {
    return renderMarketingLayout(page, renderedBlocks, locale, localePrefixes);
  }

  if (layout === "info") {
    return renderInfoLayout(page, renderedBlocks, locale, localePrefixes);
  }

  return renderDefaultLayout(page, renderedBlocks, locale, localePrefixes);
}

function renderDefaultLayout(
  page: MarkdownPage,
  blocks: MarkdownPageBlock[],
  locale: string,
  localePrefixes?: readonly string[]
) {
  const actions = renderActionRow(page.frontmatter.actions, locale, localePrefixes);
  return (
    <div className="page-shell space-y-6">
      <SectionHeader
        eyebrow={page.frontmatter.eyebrow}
        title={page.frontmatter.title}
        description={page.frontmatter.description}
        actions={actions}
      />
      {blocks.map((block, index) => (
        <MarkdownPageBlockView
          key={`${block.type}-${index}`}
          block={block}
          locale={locale}
          localePrefixes={localePrefixes}
        />
      ))}
    </div>
  );
}

function renderInfoLayout(
  page: MarkdownPage,
  blocks: MarkdownPageBlock[],
  locale: string,
  localePrefixes?: readonly string[]
) {
  const actions = renderActionRow(page.frontmatter.actions, locale, localePrefixes);
  return (
    <InfoPage
      backHref={page.frontmatter.backHref}
      backLabel={page.frontmatter.backLabel}
      eyebrow={page.frontmatter.eyebrow}
      title={page.frontmatter.title}
      description={page.frontmatter.description}
      actions={actions}
      cardClassName="space-y-6"
    >
      {blocks.map((block, index) => (
        <MarkdownInfoBlockView
          key={`${block.type}-${index}`}
          block={block}
          locale={locale}
          localePrefixes={localePrefixes}
        />
      ))}
    </InfoPage>
  );
}

function renderMarketingLayout(
  page: MarkdownPage,
  blocks: MarkdownPageBlock[],
  locale: string,
  localePrefixes?: readonly string[]
) {
  const heroBlock = blocks.find((block) => block.type === "hero");
  if (!heroBlock || heroBlock.type !== "hero") {
    throw new Error(`[content] Missing hero block for marketing page "${page.slug}".`);
  }
  const sectionBlocks = blocks.filter((block) => block !== heroBlock);

  return (
    <MarketingPage
      className="space-y-6"
      hero={renderMarketingHero(heroBlock, locale, localePrefixes)}
      sections={
        sectionBlocks.length ? (
          <div className="space-y-6">
            {sectionBlocks.map((block, index) => (
              <MarkdownMarketingBlockView
                key={`${block.type}-${index}`}
                block={block}
                locale={locale}
                localePrefixes={localePrefixes}
              />
            ))}
          </div>
        ) : undefined
      }
    />
  );
}

function renderActionRow(
  actions: MarkdownPageAction[] | undefined,
  locale: string,
  localePrefixes?: readonly string[],
  className = "flex flex-wrap gap-2"
) {
  if (!actions?.length) return undefined;
  return (
    <div className={className}>
      {actions.map((action) => (
        <Button
          key={`${action.href}-${action.label}`}
          href={localizeHref(action.href, locale, localePrefixes)}
          size="md"
          variant={action.variant ?? "primary"}
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
}

function renderMarketingHero(
  block: Extract<MarkdownPageBlock, { type: "hero" }>,
  locale: string,
  localePrefixes?: readonly string[]
) {
  const stats = block.stats;
  return (
    <Card className="grid gap-8 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] sm:items-start">
      <div className="space-y-6">
        <h1 className="text-4xl font-semibold leading-tight text-muted-strong sm:text-5xl">
          {block.title}
        </h1>
        <p className="text-lg text-muted sm:max-w-2xl">{block.subtitle}</p>
        {renderActionRow(block.actions, locale, localePrefixes, "flex flex-col gap-3 sm:flex-row")}
        <div className="grid gap-4 text-sm text-muted sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={`${stat.value}-${stat.detail}`} className="rounded-2xl border border-border bg-surface-muted p-4 shadow-sm">
              <p className="text-2xl font-semibold text-primary">{stat.value}</p>
              <p>{stat.detail}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="sm:space-y-4">
        {block.image ? (
          <div className="hidden sm:block">
            <div className="overflow-hidden rounded-2xl border border-border bg-surface-muted shadow-sm">
              <Image
                src={block.image.src}
                alt={block.image.alt}
                width={800}
                height={533}
                sizes="(min-width: 1024px) 40vw, (min-width: 640px) 45vw, 100vw"
                className="h-auto w-full object-cover"
              />
            </div>
          </div>
        ) : null}
        <div className="rounded-2xl border border-border bg-surface-muted p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
            {block.flowTitle}
          </p>
          <ul className="mt-4 space-y-4 text-sm text-muted">
            {block.flowItems.map((step, idx) => (
              <li key={`${step.label}-${idx}`} className="flex gap-3">
                <span className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {idx + 1}
                </span>
                <div className="space-y-1">
                  <p className="font-semibold text-foreground">{step.label}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}

function MarkdownMarketingBlockView({
  block,
  locale,
  localePrefixes,
}: {
  block: MarkdownPageBlock;
  locale: string;
  localePrefixes?: readonly string[];
}) {
  if (block.type === "services") {
    return (
      <Card className="space-y-6">
        <SectionHeader title={block.title} description={block.description} />
        <div className="grid gap-4 md:grid-cols-2">
          {block.items.map((item) => (
            <Link
              key={`${item.href}-${item.title}`}
              href={localizeHref(item.href, locale, localePrefixes)}
              className="group rounded-2xl border border-border bg-surface-muted p-5 shadow-sm transition hover:border-primary"
            >
              {item.image ? (
                <div className="mb-4 overflow-hidden rounded-2xl border border-border bg-surface">
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    width={640}
                    height={420}
                    sizes="(min-width: 1024px) 30vw, 90vw"
                    className="h-auto w-full object-cover"
                  />
                </div>
              ) : null}
              <div className="space-y-2">
                <p className="text-lg font-semibold text-muted-strong group-hover:text-primary">
                  {item.title}
                </p>
                <p className="text-sm text-muted">{item.body}</p>
              </div>
            </Link>
          ))}
        </div>
      </Card>
    );
  }

  if (block.type === "locations") {
    return (
      <Card className="space-y-6">
        <SectionHeader title={block.title} description={block.description} />
        <div className="flex flex-wrap gap-3">
          {block.items.map((item) => (
            <Button
              key={`${item.slug}-${item.label}`}
              variant="secondary"
              size="md"
              href={localizeHref(`/paikkakunnat/${item.slug}`, locale, localePrefixes)}
            >
              {item.label}
            </Button>
          ))}
          {block.allLabel && block.allHref ? (
            <Button
              variant="ghost"
              size="md"
              href={localizeHref(block.allHref, locale, localePrefixes)}
            >
              {block.allLabel}
            </Button>
          ) : null}
        </div>
      </Card>
    );
  }

  if (block.type === "companyTeaser") {
    return (
      <Card className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <div className="space-y-2">
          <p className="text-xl font-semibold text-foreground">{block.title}</p>
          <p className="text-sm text-muted">{block.description}</p>
        </div>
        <Button href={localizeHref(block.cta.href, locale, localePrefixes)} size="md">
          {block.cta.label}
        </Button>
      </Card>
    );
  }

  if (block.type === "highlights") {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {block.items.map((item) => (
          <Card key={item.title} className="space-y-2">
            <p className="text-lg font-semibold text-muted-strong">{item.title}</p>
            <p className="text-sm text-muted">{item.body}</p>
          </Card>
        ))}
      </div>
    );
  }

  if (block.type === "twoColumn") {
    return (
      <Card className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            {block.left.label}
          </p>
          <p className="text-xl font-semibold text-foreground">{block.left.title}</p>
          <div className="space-y-3">
            {block.left.steps.map((step, idx) => (
              <div key={`${step.title}-${idx}`} className="flex gap-3">
                <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {idx + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold text-muted-strong">{step.title}</p>
                  <p className="text-sm text-muted">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            {block.right.label}
          </p>
          <p className="text-xl font-semibold text-foreground">{block.right.title}</p>
          <div className="space-y-3">
            {block.right.items.map((item) => (
              <div key={item.title} className="space-y-1">
                <p className="text-sm font-semibold text-muted-strong">{item.title}</p>
                <p className="text-sm text-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (block.type === "audiences") {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[block.consumer, block.company].map((audience) => (
          <Card key={audience.label} className="space-y-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                {audience.label}
              </p>
              <p className="text-xl font-semibold text-foreground">{audience.title}</p>
            </div>
            <p className="text-sm text-muted">{audience.body}</p>
            <ul className="space-y-2 text-sm text-muted">
              {audience.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
            <Button
              href={localizeHref(audience.cta.href, locale, localePrefixes)}
              size="md"
              variant={audience.cta.variant ?? "secondary"}
            >
              {audience.cta.label}
            </Button>
          </Card>
        ))}
      </div>
    );
  }

  if (block.type === "steps") {
    return (
      <Card className="space-y-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          {block.stepLabel}
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {block.items.map((step, idx) => (
            <div key={`${step.title}-${idx}`} className="space-y-2">
              <p className="text-lg font-semibold text-foreground">{step.title}</p>
              <p className="text-sm text-muted">{step.detail}</p>
            </div>
          ))}
        </div>
        {block.actions?.length ? renderActionRow(block.actions, locale, localePrefixes) : null}
      </Card>
    );
  }

  if (block.type === "faq") {
    return (
      <Card className="space-y-4">
        <SectionHeader title={block.title} />
        <div className="space-y-4">
          {block.items.map((item, idx) => (
            <details key={`${item.q}-${idx}`} className="rounded-2xl border border-border bg-surface-muted px-4 py-3">
              <summary className="cursor-pointer text-sm font-semibold text-foreground">
                {item.q}
              </summary>
              <p className="mt-2 text-sm text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </Card>
    );
  }

  if (block.type === "markdown") {
    return (
      <Card className="space-y-4">
        {block.title ? (
          <p className="text-sm font-semibold text-muted-strong">{block.title}</p>
        ) : null}
        <MarkdownContent content={block.content} locale={locale} localePrefixes={localePrefixes} />
      </Card>
    );
  }

  return null;
}

function MarkdownInfoBlockView({
  block,
  locale,
  localePrefixes,
}: {
  block: MarkdownPageBlock;
  locale: string;
  localePrefixes?: readonly string[];
}) {
  if (block.type === "markdown") {
    return (
      <div className="space-y-4">
        {block.title ? (
          <p className="text-sm font-semibold text-muted-strong">{block.title}</p>
        ) : null}
        <MarkdownContent content={block.content} locale={locale} localePrefixes={localePrefixes} />
      </div>
    );
  }

  if (block.type === "faq") {
    return (
      <div className="space-y-4">
        <SectionHeader title={block.title} />
        <div className="space-y-4">
          {block.items.map((item, idx) => (
            <details key={`${item.q}-${idx}`} className="rounded-2xl border border-border bg-surface-muted px-4 py-3">
              <summary className="cursor-pointer text-sm font-semibold text-foreground">
                {item.q}
              </summary>
              <p className="mt-2 text-sm text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    );
  }

  return <MarkdownMarketingBlockView block={block} locale={locale} localePrefixes={localePrefixes} />;
}

function MarkdownPageBlockView({
  block,
  locale,
  localePrefixes,
}: {
  block: MarkdownPageBlock;
  locale: string;
  localePrefixes?: readonly string[];
}) {
  if (block.type === "markdown") {
    return (
      <Card className="space-y-4">
        {block.title ? (
          <p className="text-sm font-semibold text-muted-strong">{block.title}</p>
        ) : null}
        <MarkdownContent content={block.content} locale={locale} localePrefixes={localePrefixes} />
      </Card>
    );
  }

  if (block.type === "faq") {
    return (
      <Card className="space-y-4">
        <SectionHeader title={block.title} />
        <div className="space-y-4">
          {block.items.map((item, idx) => (
            <details key={`${item.q}-${idx}`} className="rounded-2xl border border-border bg-surface-muted px-4 py-3">
              <summary className="cursor-pointer text-sm font-semibold text-foreground">
                {item.q}
              </summary>
              <p className="mt-2 text-sm text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </Card>
    );
  }

  if (block.type === "highlights") {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {block.items.map((item) => (
          <Card key={item.title} className="space-y-2">
            <p className="text-lg font-semibold text-muted-strong">{item.title}</p>
            <p className="text-sm text-muted">{item.body}</p>
          </Card>
        ))}
      </div>
    );
  }

  return <MarkdownMarketingBlockView block={block} locale={locale} localePrefixes={localePrefixes} />;
}
