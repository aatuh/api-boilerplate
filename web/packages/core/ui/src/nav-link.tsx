"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LinkProps } from "next/link";
import type { ReactNode } from "react";
import { cx } from "./cx";

type NavLinkProps = LinkProps & {
  children: ReactNode;
  className?: string;
  activeClassName?: string;
  inactiveClassName?: string;
  exact?: boolean;
};

const normalize = (value: string) => {
  const clean = value.split("?")[0]?.split("#")[0] ?? "";
  const trimmed = clean.replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
};

const resolveHref = (href: LinkProps["href"]) => {
  if (typeof href === "string") return href;
  if (href && typeof href === "object" && "pathname" in href) {
    return href.pathname || "/";
  }
  return "/";
};

export function NavLink({
  href,
  children,
  className,
  activeClassName,
  inactiveClassName,
  exact,
  ...rest
}: NavLinkProps) {
  const pathname = usePathname() || "/";
  const target = normalize(resolveHref(href));
  const current = normalize(pathname);
  const matchExact = exact || target === "/";
  const isActive = matchExact
    ? current === target
    : current === target || current.startsWith(`${target}/`);

  return (
    <Link
      href={href}
      className={cx(className, isActive ? activeClassName : inactiveClassName)}
      {...rest}
    >
      {children}
    </Link>
  );
}
