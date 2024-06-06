import { redirect } from "next/navigation";

import { dehydrate, Hydrate } from "@tanstack/react-query";
import { getServerSession } from "next-auth";

import getQueryClient from "@/lib/react-query/getQueryClient";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

import Header from "@/containers/header";

import LayoutProviders from "../../layout-providers";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const queryClient = getQueryClient();

  const dehydratedState = dehydrate(queryClient);

  if (session) {
    redirect("/signin");
  }

  return (
    <LayoutProviders session={session}>
      <Hydrate state={dehydratedState}>
        <main className="h-[100svh] w-full divide-y-2 divide-gray-300/20">
          <Header />
          <section className="flex grow flex-col items-center justify-center">{children}</section>
        </main>
      </Hydrate>
    </LayoutProviders>
  );
}
