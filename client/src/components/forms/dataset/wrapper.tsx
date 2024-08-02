"use client";

import { cn } from "@/lib/classnames";

export default function DashboardFormWrapper({
  children,
  header = true,
  className,
}: {
  children: React.ReactNode;
  header?: boolean;
  className?: string;
}) {
  return (
    <section
      className={cn({
        "flex w-full flex-1 flex-col items-center justify-center": true,
        [className as string]: !!className,
      })}
    >
      <div className={cn({ "w-full max-w-3xl space-y-10": true, "py-10": header })}>{children}</div>
    </section>
  );
}
