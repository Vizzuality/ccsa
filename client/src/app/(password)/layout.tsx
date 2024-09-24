import { dehydrate } from "@tanstack/react-query";
import { Hydrate } from "@tanstack/react-query";

import getQueryClient from "@/lib/react-query/getQueryClient";

import Header from "@/containers/header";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <main className="h-[100svh] w-full divide-y-2 divide-gray-300/20">
        <Header />
        <section className="flex grow flex-col items-center justify-center">{children}</section>
      </main>
    </Hydrate>
  );
}
