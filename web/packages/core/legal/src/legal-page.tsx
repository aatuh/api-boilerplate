import type { ReactNode } from "react";
import type { LegalBlock, LegalDoc } from "./types";
import { InfoPage } from "@api-boilerplate/layouts";
import { cx } from "@api-boilerplate/ui";

type LegalPageProps = {
  doc: LegalDoc;
  backHref?: string;
  backLabel?: string;
  className?: string;
  cardClassName?: string;
  descriptionSlot?: ReactNode;
};

function renderBlock(block: LegalBlock, index: number) {
  if (block.type === "paragraph") {
    return (
      <p key={index} className="text-sm text-muted leading-relaxed">
        {linkifyText(block.text)}
      </p>
    );
  }

  if (block.type === "list") {
    return (
      <ul key={index} className="list-disc space-y-2 pl-5 text-sm text-muted">
        {block.items.map((item) => (
          <li key={item}>{linkifyText(item)}</li>
        ))}
      </ul>
    );
  }

  if (block.type === "note") {
    return (
      <div
        key={index}
        className="rounded-2xl border border-border bg-surface-muted px-4 py-3 text-sm text-muted whitespace-pre-line"
      >
        {linkifyText(block.text)}
      </div>
    );
  }

  if (block.type === "table") {
    return (
      <div key={index} className="overflow-x-auto rounded-2xl border border-border">
        {block.caption ? (
          <p className="border-b border-border bg-surface-muted px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-strong">
            {block.caption}
          </p>
        ) : null}
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-surface-muted text-xs font-semibold uppercase tracking-[0.15em] text-muted-strong">
            <tr>
              {block.headers.map((header) => (
                <th key={header} className="border-b border-border px-4 py-3">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-border last:border-b-0">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-4 py-3 align-top text-muted">
                    {linkifyText(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return null;
}

function linkifyText(text: string): ReactNode {
  const markdownPattern = /\[([^\]]+)\]\(((?:https?:\/\/)[^\s)]+|\/[A-Za-z0-9\-._~/%]+)\)/g;
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = markdownPattern.exec(text)) !== null) {
    const [full, label, path] = match;
    const start = match.index;
    if (start > lastIndex) {
      parts.push(...linkifyBarePaths(text.slice(lastIndex, start)));
    }
    parts.push(
      <a key={`${path}-${start}`} href={path} className="text-primary transition hover:text-primary-strong">
        {label}
      </a>
    );
    lastIndex = start + full.length;
  }

  if (lastIndex < text.length) {
    parts.push(...linkifyBarePaths(text.slice(lastIndex)));
  }

  if (parts.length === 0) return text;
  return parts;
}

function linkifyBarePaths(text: string): ReactNode[] {
  const pattern = /(^|[\s(])((?:\/[A-Za-z0-9\-._~/%]+)+)(?=$|[)\s.,!?])/g;
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    const [full, prefix, path] = match;
    const start = match.index;
    if (start > lastIndex) {
      parts.push(text.slice(lastIndex, start));
    }
    if (prefix) parts.push(prefix);
    parts.push(
      <a key={`${path}-${start}`} href={path} className="text-primary transition hover:text-primary-strong">
        {path}
      </a>
    );
    lastIndex = start + full.length;
  }

  if (parts.length === 0) return [text];
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

export function LegalPage({
  doc,
  backHref,
  backLabel,
  className,
  cardClassName,
  descriptionSlot,
}: LegalPageProps) {
  const showToc = doc.sections.length > 1;
  const tocLabel = doc.tocLabel ?? "Contents";
  const updatedLabel = doc.updatedLabel ?? "Last updated";

  return (
    <InfoPage
      backHref={backHref}
      backLabel={backLabel}
      eyebrow={doc.eyebrow}
      title={doc.title}
      description={doc.summary}
      className={className}
      cardClassName={cx("space-y-6", cardClassName)}
    >
      {descriptionSlot}
      <div className="space-y-6">
        {doc.updatedAt ? (
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-strong">
            {updatedLabel}: {doc.updatedAt}
          </p>
        ) : null}

        {showToc ? (
          <nav className="rounded-2xl border border-border bg-surface-muted px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-strong">{tocLabel}</p>
            <ul className="mt-3 space-y-2 text-sm">
              {doc.sections.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className="text-primary transition hover:text-primary-strong">
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}

        {doc.sections.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-24 space-y-3">
            <h2 className="text-lg font-semibold text-foreground">{section.title}</h2>
            <div className="space-y-3">
              {section.blocks.map((block, index) => renderBlock(block, index))}
            </div>
          </section>
        ))}
      </div>
    </InfoPage>
  );
}
