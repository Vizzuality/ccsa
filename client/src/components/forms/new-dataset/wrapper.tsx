"use client";

export default function NewDatasetDataFormWrapper({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex w-full flex-1 flex-col items-center justify-center">
      <div className="w-full max-w-3xl space-y-10 py-10">{children}</div>
    </section>
  );
}
