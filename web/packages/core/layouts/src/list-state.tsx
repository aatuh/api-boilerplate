"use client";

import { StatusText } from "./status-text";

type ListStateStatus = "idle" | "loading" | "error";

type ListStateProps = {
  status?: ListStateStatus;
  loading?: boolean;
  isEmpty?: boolean;
  loadingText?: string;
  emptyText?: string;
  errorText?: string;
  error?: string | null;
  className?: string;
};

export function ListState({
  status,
  loading,
  isEmpty,
  loadingText,
  emptyText,
  errorText,
  error,
  className,
}: ListStateProps) {
  const resolvedStatus: ListStateStatus =
    status ?? (loading ? "loading" : error ? "error" : "idle");

  if (resolvedStatus === "loading" && loadingText) {
    return <StatusText className={className}>{loadingText}</StatusText>;
  }

  if (resolvedStatus === "error" && (error || errorText)) {
    return (
      <StatusText tone="error" className={className}>
        {error || errorText}
      </StatusText>
    );
  }

  if (resolvedStatus === "idle" && isEmpty && emptyText) {
    return <StatusText className={className}>{emptyText}</StatusText>;
  }

  return null;
}
