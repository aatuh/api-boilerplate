"use client";

import type { ReactNode } from "react";
import { cx } from "@api-boilerplate/ui";

export type DetailItem = {
  label: string;
  value?: ReactNode | null;
  fallback?: ReactNode;
};

type DetailGridProps = {
  items: DetailItem[];
  columns?: 1 | 2 | 3;
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
  fallbackClassName?: string;
};

export function DetailGrid({
  items,
  columns = 2,
  className,
  labelClassName,
  valueClassName,
  fallbackClassName,
}: DetailGridProps) {
  const gridClass =
    columns === 3 ? "sm:grid-cols-3" : columns === 1 ? "sm:grid-cols-1" : "sm:grid-cols-2";

  return (
    <div className={cx("grid gap-4", gridClass, className)}>
      {items.map((item) => {
        const hasValue = !(item.value === null || item.value === undefined || item.value === "");
        return (
          <div key={item.label} className="space-y-1">
            <p className={cx("text-xs uppercase tracking-wide text-muted", labelClassName)}>{item.label}</p>
            <div className={cx("text-sm text-foreground", valueClassName)}>
              {hasValue ? (
                item.value
              ) : (
                <span className={cx("text-muted", fallbackClassName)}>{item.fallback ?? "—"}</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
