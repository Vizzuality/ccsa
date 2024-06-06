import { dehydrate } from "@tanstack/react-query";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";

import Header from "@/containers/header";
import Footer from "@/containers/footer";

import getQueryClient from "@/lib/react-query/getQueryClient";

import { Hydrate } from "@tanstack/react-query";

import LayoutProviders from "../layout-providers";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const queryClient = getQueryClient();

  const dehydratedState = dehydrate(queryClient);

  return (
    <LayoutProviders session={session}>
      <Hydrate state={dehydratedState}>
        <main className="h-[100svh] w-full divide-y-2 divide-gray-300/20">
          <Header />
          <section className="flex grow flex-col items-center justify-center">{children}</section>
          <Footer />
        </main>
      </Hydrate>
    </LayoutProviders>
  );
}
