import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type ContentSectionProps = {
  children: ReactNode;
  className?: string;
  spaceBetween?: "sm" | "md" | "lg";
};

const spacingMap = {
  sm: "space-y-3",
  md: "space-y-6",
  lg: "space-y-8",
};

export function ContentSection({
  children,
  className,
  spaceBetween = "md",
}: ContentSectionProps) {
  return (
    <div className={cn("flex flex-col", spacingMap[spaceBetween], className)}>
      {children}
    </div>
  );
}
