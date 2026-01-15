import type { ReactNode } from "react";
import { Card, cx } from "@api-boilerplate/ui";
import { DashboardPage } from "./dashboard-page";
import { EmptyState } from "./empty-state";
import { ListState } from "./list-state";

type EmptyConfig = {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
  align?: "left" | "center";
};

type EntityListPageProps<T> = {
  backHref?: string;
  backLabel?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  filters?: ReactNode;
  items?: T[];
  renderItem: (item: T) => ReactNode;
  status?: "idle" | "loading" | "error";
  loadingText?: string;
  errorText?: string;
  emptyText?: string;
  emptyState?: EmptyConfig;
  listClassName?: string;
  className?: string;
};

export function EntityListPage<T>({
  backHref,
  backLabel,
  eyebrow,
  title,
  description,
  actions,
  filters,
  items = [],
  renderItem,
  status,
  loadingText,
  errorText,
  emptyText,
  emptyState,
  listClassName,
  className,
}: EntityListPageProps<T>) {
  const isEmpty = items.length === 0;

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
      {filters ? <Card padding="md">{filters}</Card> : null}
      <ListState status={status} loadingText={loadingText} errorText={errorText} emptyText={emptyText} isEmpty={isEmpty} />
      {status !== "loading" && status !== "error" && isEmpty && emptyState ? (
        <EmptyState {...emptyState} />
      ) : null}
      {!isEmpty ? <div className={cx("grid gap-3", listClassName)}>{items.map(renderItem)}</div> : null}
    </DashboardPage>
  );
}
