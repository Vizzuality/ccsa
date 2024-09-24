import { dehydrate, Hydrate } from "@tanstack/react-query";

import getQueryClient from "@/lib/react-query/getQueryClient";

import DashboardHeader from "@/containers/dashboard-header";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <main className="h-[100svh] w-full">
        <DashboardHeader />
        <section className="flex grow flex-col items-center justify-center">{children}</section>
      </main>
    </Hydrate>
  );
}
