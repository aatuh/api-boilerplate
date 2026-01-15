"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useLocale } from "@api-boilerplate/i18n-shared/locale-context";

type BackNavProps = {
  href?: string;
  label?: string;
  icon?: ReactNode;
};

// Reusable back navigation bar for dashboard sub-pages (mobile-first).
export function BackNav({ href, label, icon }: BackNavProps) {
  const router = useRouter();
  const { t } = useLocale();
  const resolvedLabel = label ?? t("common.controls.back");
  const content = (
    <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
      {icon ?? <span aria-hidden="true">←</span>}
      {resolvedLabel}
    </span>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="inline-flex max-w-fit items-center rounded-full border border-border bg-surface px-3 py-2 text-muted-strong shadow-sm transition hover:-translate-y-0.5 hover:border-primary hover:text-primary"
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="inline-flex max-w-fit items-center rounded-full border border-border bg-surface px-3 py-2 text-muted-strong shadow-sm transition hover:-translate-y-0.5 hover:border-primary hover:text-primary"
    >
      {content}
    </button>
  );
}
