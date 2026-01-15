"use client";

import type { ReactNode } from "react";
import { cx } from "@api-boilerplate/ui";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
  align?: "left" | "center";
  className?: string;
};

export function EmptyState({
  title,
  description,
  action,
  icon,
  align = "left",
  className,
}: EmptyStateProps) {
  const alignClass = align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <div
      className={cx(
        "flex w-full flex-col gap-2 rounded-2xl border border-dashed border-border bg-surface-muted px-4 py-5",
        alignClass,
        className
      )}
    >
      {icon ? <div className="text-2xl text-primary">{icon}</div> : null}
      <p className="text-sm font-semibold text-foreground">{title}</p>
      {description ? <p className="text-sm text-muted">{description}</p> : null}
      {action ? <div className="pt-2">{action}</div> : null}
    </div>
  );
}
