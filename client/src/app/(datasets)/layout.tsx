import Link from "next/link";

import { dehydrate, Hydrate } from "@tanstack/react-query";

import getQueryClient from "@/lib/react-query/getQueryClient";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import LayoutProviders from "./layout-providers";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  const dehydratedState = dehydrate(queryClient);

  return (
    <LayoutProviders>
      <Hydrate state={dehydratedState}>
        <main className="h-[100svh] w-full ">
          <div className="relative z-20 flex w-full flex-col space-y-8 p-4 sm:px-10 md:px-24 lg:px-32">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/">Map</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/dashboard">My profile</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>New dataset</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          {children}
        </main>
      </Hydrate>
    </LayoutProviders>
  );
}