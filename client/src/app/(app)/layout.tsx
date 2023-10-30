import { PropsWithChildren } from "react";

import { Hydrate, dehydrate } from "@tanstack/react-query";

import getQueryClient from "@/lib/react-query/getQueryClient";

import { getGetCategoriesQueryKey, getGetCategoriesQueryOptions } from "@/types/generated/category";
import { getGetDatasetsQueryOptions } from "@/types/generated/dataset";
import { CategoryListResponse } from "@/types/generated/strapi.schemas";

import Map from "@/containers/map";
import Navigation from "@/containers/navigation";
import Sidebar from "@/containers/sidebar";

import LayoutProviders from "./layout-providers";

export default async function AppLayout({ children }: PropsWithChildren) {
  const queryClient = getQueryClient();

  // Prefetch categories
  await queryClient.prefetchQuery({
    ...getGetCategoriesQueryOptions({
      "pagination[pageSize]": 100,
      populate: "datasets",
    }),
  });

  const CATEGORIES = queryClient.getQueryData<CategoryListResponse>(
    getGetCategoriesQueryKey({
      "pagination[pageSize]": 100,
      populate: "datasets",
    }),
  );

  for (const category of CATEGORIES?.data || []) {
    if (!category.id) continue;

    // Prefetch datasets
    await queryClient.prefetchQuery({
      ...getGetDatasetsQueryOptions({
        "pagination[pageSize]": 100,
        filters: {
          category: category.id,
        },
        populate: "*",
      }),
    });
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <LayoutProviders>
      <Hydrate state={dehydratedState}>
        <main className="flex h-[100svh] w-full justify-between">
          <Navigation />
          <Sidebar>{children}</Sidebar>
          <Map />
        </main>
      </Hydrate>
    </LayoutProviders>
  );
}
