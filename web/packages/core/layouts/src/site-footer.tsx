import Link from "next/link";
import type { ReactNode } from "react";

type Brand = {
  name: string;
  shortName: string;
  href?: string;
  orgName?: string;
};

export type FooterLink = {
  href: string;
  label: string;
};

export type FooterSection = {
  title: string;
  links: FooterLink[];
};

type SiteFooterProps = {
  brand: Brand;
  lead?: string;
  sections?: FooterSection[];
  actions?: ReactNode;
  copyright?: string;
};

export function SiteFooter({ brand, lead, sections = [], actions, copyright }: SiteFooterProps) {
  const note = copyright || `© ${new Date().getFullYear()} ${brand.orgName || brand.name}`;
  return (
    <footer className="mx-auto w-full max-w-6xl px-6 py-10 text-xs text-muted">
      <div className="grid gap-8 md:grid-cols-[1.2fr_repeat(3,1fr)]">
        <div className="space-y-3">
          <Link className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-muted-strong" href={brand.href || "/"}>
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-linear-to-br from-primary to-primary-strong text-white shadow-soft">
              {brand.shortName}
            </span>
            <span>{brand.name}</span>
          </Link>
          {lead ? <p className="text-sm text-muted">{lead}</p> : null}
        </div>
        {sections.map((section) => (
          <div key={section.title} className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-strong">{section.title}</p>
            <div className="flex flex-col gap-1 text-sm">
              {section.links.map((link) => (
                <Link key={`${section.title}-${link.href}`} className="transition hover:text-primary" href={link.href}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex flex-col gap-3 text-[11px] text-muted sm:flex-row sm:items-center sm:justify-between">
        <span>{note}</span>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
    </footer>
  );
}
