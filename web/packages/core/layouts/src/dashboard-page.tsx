import type { ReactNode } from "react";
import { BackNav } from "./back-nav";
import { SectionHeader } from "@api-boilerplate/ui";
import { cx } from "@api-boilerplate/ui";

type Props = {
  backHref?: string;
  backLabel?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  showBackNav?: boolean;
};

// Consistent shell for dashboard sub-pages with back navigation and header.
export function DashboardPage({
  backHref,
  backLabel,
  eyebrow,
  title,
  description,
  actions,
  children,
  className,
  showBackNav = true,
}: Props) {
  return (
    <div className={cx("page-shell space-y-6", className)}>
      <div className="space-y-4">
        {showBackNav ? <BackNav href={backHref} label={backLabel} /> : null}
        <SectionHeader eyebrow={eyebrow} title={title} description={description} actions={actions} />
      </div>
      {children}
    </div>
  );
}
