import type { ReactNode } from "react";
import { Card, cx } from "@api-boilerplate/ui";
import { DashboardPage } from "./dashboard-page";
import { DetailGrid, type DetailItem } from "./detail-grid";

type EntityDetailPageProps = {
  backHref?: string;
  backLabel?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  fields?: DetailItem[];
  children?: ReactNode;
  className?: string;
  cardClassName?: string;
};

export function EntityDetailPage({
  backHref,
  backLabel,
  eyebrow,
  title,
  description,
  actions,
  fields = [],
  children,
  className,
  cardClassName,
}: EntityDetailPageProps) {
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
      {fields.length > 0 ? (
        <Card padding="md" className={cx("space-y-4", cardClassName)}>
          <DetailGrid items={fields} />
        </Card>
      ) : null}
      {children}
    </DashboardPage>
  );
}
