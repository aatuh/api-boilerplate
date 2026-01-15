"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useAnalytics } from "./context";

export function AnalyticsListener() {
  const { trackPageview } = useAnalytics();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.toString();
    const url = query ? `${pathname}?${query}` : pathname;
    trackPageview({ url });
  }, [pathname, searchParams, trackPageview]);

  return null;
}
