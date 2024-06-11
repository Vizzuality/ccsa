import { dehydrate, Hydrate } from "@tanstack/react-query";
import { getServerSession } from "next-auth";

import getQueryClient from "@/lib/react-query/getQueryClient";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import LayoutProviders from "../layout-providers";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const queryClient = getQueryClient();

  const dehydratedState = dehydrate(queryClient);

  return (
    <LayoutProviders session={session}>
      <Hydrate state={dehydratedState}>
        <main className="h-[100svh] w-full">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink>
                  <Link href="/map">Map</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink>
                  <Link href="/dashboard">My profile</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>New dataset</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="relative z-20 m-auto flex h-24 w-full items-center justify-between p-4 sm:px-10 md:px-24 lg:px-32">
            <h1 className="text-3xl font-bold -tracking-[0.0375rem]">New dataset</h1>

            <div className="flex flex-col items-center space-x-2 text-sm sm:flex-row">
              <Button size="sm" variant="primary-outline">
                Cancel
              </Button>
              <Button size="sm">Continue</Button>
            </div>
          </div>
          <section className="flex grow flex-col items-center justify-center">{children}</section>
        </main>
      </Hydrate>
    </LayoutProviders>
  );
}
