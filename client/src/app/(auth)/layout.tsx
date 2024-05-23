import { redirect } from "next/navigation";

import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";

import Navigation from "@/containers/navigation";
import getQueryClient from "@/lib/react-query/getQueryClient";
import { dehydrate } from "@tanstack/react-query";

import { Hydrate } from "@tanstack/react-query";

import LayoutProviders from "../layout-providers";

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
        <main className="flex h-[100svh] w-full justify-between">
          <Navigation />
          {children}
        </main>
      </Hydrate>
    </LayoutProviders>
  );
}
