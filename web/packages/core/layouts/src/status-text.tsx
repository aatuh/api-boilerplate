"use client";

import type { ReactNode } from "react";
import { cx } from "@api-boilerplate/ui";

type StatusTone = "muted" | "error" | "success" | "warning";

const toneClasses: Record<StatusTone, string> = {
  muted: "text-muted",
  error: "text-red-600",
  success: "text-emerald-600",
  warning: "text-amber-700",
};

type StatusTextProps = {
  children: ReactNode;
  tone?: StatusTone;
  className?: string;
};

export function StatusText({ children, tone = "muted", className }: StatusTextProps) {
  return <p className={cx("text-sm", toneClasses[tone], className)}>{children}</p>;
}
