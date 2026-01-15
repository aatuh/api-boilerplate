import Link from "next/link";
import type { ReactNode } from "react";

type Brand = {
  name: string;
  shortName: string;
  href?: string;
};

type SiteHeaderProps = {
  brand: Brand;
  signedOut?: ReactNode;
  signedIn?: ReactNode;
};

export function SiteHeader({ brand, signedOut, signedIn }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-border glass-surface">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:flex-nowrap sm:px-6">
        <Link
          className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-muted-strong"
          href={brand.href || "/"}
        >
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-linear-to-br from-primary to-primary-strong text-white shadow-soft">
            {brand.shortName}
          </span>
          <span>{brand.name}</span>
        </Link>
        <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-muted-strong">
          {signedOut}
          {signedIn}
        </div>
      </div>
    </header>
  );
}
