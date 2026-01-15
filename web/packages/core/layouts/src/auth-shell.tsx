import type { ReactNode } from "react";
import { cx } from "@api-boilerplate/ui";

type AuthShellProps = {
  children: ReactNode;
  intro?: ReactNode;
  footer?: ReactNode;
  className?: string;
  contentClassName?: string;
  introClassName?: string;
};

export function AuthShell({ children, intro, footer, className, contentClassName, introClassName }: AuthShellProps) {
  const hasIntro = Boolean(intro || footer);
  return (
    <div className={cx("flex min-h-[70vh] items-center justify-center py-12", className)}>
      <div
        className={cx(
          "w-full",
          hasIntro
            ? "grid max-w-4xl gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,360px)] md:items-center"
            : "flex max-w-md justify-center"
        )}
      >
        {hasIntro ? (
          <div className={cx("space-y-4 text-sm text-muted", introClassName)}>
            {intro}
            {footer ? <div className="pt-2 text-xs text-muted">{footer}</div> : null}
          </div>
        ) : null}
        <div className={cx(hasIntro ? "flex justify-center" : "", contentClassName)}>{children}</div>
      </div>
    </div>
  );
}
