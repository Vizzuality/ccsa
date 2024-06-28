import Link from "next/link";

import { dehydrate, Hydrate } from "@tanstack/react-query";

import getQueryClient from "@/lib/react-query/getQueryClient";

import { getGetCategoriesQueryOptions } from "@/types/generated/category";
import { getGetCountriesQueryOptions } from "@/types/generated/country";

import { GET_COUNTRIES_OPTIONS } from "@/constants/countries";
import { GET_CATEGORIES_OPTIONS } from "@/constants/datasets";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(getGetCountriesQueryOptions(GET_COUNTRIES_OPTIONS));

  await queryClient.prefetchQuery(getGetCategoriesQueryOptions(GET_CATEGORIES_OPTIONS()));

  const dehydratedState = dehydrate(queryClient);

  return (
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
  );
}