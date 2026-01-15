import type { ReactNode } from "react";
import { cx } from "@api-boilerplate/ui";

type AppShellProps = {
  header: ReactNode;
  footer: ReactNode;
  children: ReactNode;
  className?: string;
  mainClassName?: string;
};

export function AppShell({ header, footer, children, className, mainClassName }: AppShellProps) {
  return (
    <div className={cx("flex min-h-screen flex-col", className)}>
      {header}
      <main className={cx("mx-auto w-full max-w-6xl flex-1 px-4 sm:px-6", mainClassName)}>{children}</main>
      {footer}
    </div>
  );
}
