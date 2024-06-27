"use client";

import { cn } from "@/lib/classnames";

export default function NewDatasetDataFormWrapper({
  children,
  header = true,
}: {
  children: React.ReactNode;
  header?: boolean;
}) {
  return (
    <section className="flex w-full flex-1 flex-col items-center justify-center">
      <div className={cn({ "w-full max-w-3xl space-y-10": true, "py-10": header })}>{children}</div>
    </section>
  );
}
