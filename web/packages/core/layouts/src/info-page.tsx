import type { ReactNode } from "react";
import { Card, cx } from "@api-boilerplate/ui";
import { DashboardPage } from "./dashboard-page";

type InfoPageProps = {
  backHref?: string;
  backLabel?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  cardClassName?: string;
};

export function InfoPage({
  backHref,
  backLabel,
  eyebrow,
  title,
  description,
  actions,
  children,
  className,
  cardClassName,
}: InfoPageProps) {
  return (
    <DashboardPage
      backHref={backHref}
      backLabel={backLabel}
      eyebrow={eyebrow}
      title={title}
      description={description}
      actions={actions}
      className={className}
    >
      <Card padding="md" className={cx("space-y-3", cardClassName)}>
        {children}
      </Card>
    </DashboardPage>
  );
}
