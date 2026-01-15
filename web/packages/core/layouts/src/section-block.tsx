"use client";

import type { ReactNode } from "react";
import { cx } from "@api-boilerplate/ui";

type SectionBlockProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
};

export function SectionBlock({
  title,
  description,
  actions,
  children,
  className,
  headerClassName,
  bodyClassName,
}: SectionBlockProps) {
  return (
    <div className={cx("space-y-3", className)}>
      <div className={cx("flex items-start justify-between gap-2", headerClassName)}>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          {description ? <p className="text-sm text-muted">{description}</p> : null}
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>
      {children ? <div className={bodyClassName}>{children}</div> : null}
    </div>
  );
}
