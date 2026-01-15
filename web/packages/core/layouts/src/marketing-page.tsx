import type { ReactNode } from "react";
import { cx } from "@api-boilerplate/ui";

type MarketingPageProps = {
  hero: ReactNode;
  sections?: ReactNode;
  className?: string;
  heroClassName?: string;
  sectionsClassName?: string;
};

export function MarketingPage({ hero, sections, className, heroClassName, sectionsClassName }: MarketingPageProps) {
  return (
    <div className={cx("page-shell space-y-12", className)}>
      <div className={heroClassName}>{hero}</div>
      {sections ? <div className={sectionsClassName}>{sections}</div> : null}
    </div>
  );
}
