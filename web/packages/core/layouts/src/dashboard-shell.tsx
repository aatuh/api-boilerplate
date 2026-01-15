import Link from "next/link";
import type { ReactNode } from "react";
import { Card, SectionHeader } from "@api-boilerplate/ui";

export type DashboardTile = {
  href: string;
  title: string;
  desc: string;
};

export function DashboardShell({
  eyebrow,
  title,
  description,
  actions,
  tiles = [],
  columns = 2,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  tiles?: DashboardTile[];
  columns?: 1 | 2 | 3;
  children?: ReactNode;
}) {
  const gridClass = columns === 3 ? "sm:grid-cols-3" : columns === 1 ? "sm:grid-cols-1" : "sm:grid-cols-2";
  return (
    <div className="space-y-6">
      <SectionHeader eyebrow={eyebrow} title={title} description={description} actions={actions} />
      <div className={`grid gap-4 ${gridClass}`}>
        {tiles.map((tile) => (
          <Link key={tile.href} href={tile.href} className="block transition hover:-translate-y-1">
            <Card padding="md" className="h-full">
              <p className="text-lg font-semibold text-muted-strong">{tile.title}</p>
              <p className="mt-1 text-sm text-muted">{tile.desc}</p>
            </Card>
          </Link>
        ))}
      </div>
      {children}
    </div>
  );
}
