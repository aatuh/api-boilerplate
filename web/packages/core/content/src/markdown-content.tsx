import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { cx } from "@api-boilerplate/ui";

export type MarkdownContentProps = {
  content: string;
  locale: string;
  className?: string;
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

export function MarkdownContent({ content, locale, className, localePrefixes }: MarkdownContentProps) {
  return (
    <div className={cx("space-y-4", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children }) => (
            <h2 className="text-lg font-semibold text-foreground">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-semibold text-foreground">{children}</h3>
          ),
          p: ({ children }) => (
            <p className="text-sm leading-relaxed text-muted">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal space-y-2 pl-5 text-sm text-muted">
              {children}
            </ol>
          ),
          a: ({ href, children }) => {
            if (!href) return <span>{children}</span>;

            const isExternal =
              /^https?:\/\//.test(href) ||
              href.startsWith("mailto:") ||
              href.startsWith("tel:");

            if (isExternal) {
              return (
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-primary transition hover:text-primary-strong"
                >
                  {children}
                </a>
              );
            }

            if (href.startsWith("#")) {
              return (
                <a
                  href={href}
                  className="font-semibold text-primary transition hover:text-primary-strong"
                >
                  {children}
                </a>
              );
            }

            return (
              <Link
                href={localizeHref(href, locale, localePrefixes)}
                className="font-semibold text-primary transition hover:text-primary-strong"
              >
                {children}
              </Link>
            );
          },
          hr: () => <hr className="border-border" />,
          blockquote: ({ children }) => (
            <blockquote className="rounded-2xl border border-border bg-surface-muted px-4 py-3 text-sm text-muted">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto rounded-2xl border border-border">
              <table className="min-w-full border-collapse text-left text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-surface-muted text-xs font-semibold uppercase tracking-[0.15em] text-muted-strong">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="border-b border-border px-4 py-3">{children}</th>
          ),
          td: ({ children }) => (
            <td className="border-b border-border px-4 py-3 align-top text-muted last:border-b-0">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
