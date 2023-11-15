import { PropsWithChildren } from "react";

import { Hydrate, dehydrate } from "@tanstack/react-query";

import getQueryClient from "@/lib/react-query/getQueryClient";

import { getGetCategoriesQueryKey, getGetCategoriesQueryOptions } from "@/types/generated/category";
import { getGetCountriesQueryOptions } from "@/types/generated/country";
import { getGetDatasetsQueryOptions } from "@/types/generated/dataset";
import { getGetProjectsQueryOptions } from "@/types/generated/project";
import { CategoryListResponse } from "@/types/generated/strapi.schemas";

import { GET_COUNTRIES_OPTIONS } from "@/constants/countries";
import { GET_PROJECTS_OPTIONS } from "@/constants/projects";

import Map from "@/containers/map";
import Navigation from "@/containers/navigation";
import Sidebar from "@/containers/sidebar";

import LayoutProviders from "./layout-providers";

export default async function AppLayout({ children }: PropsWithChildren) {
  const queryClient = getQueryClient();

  // Prefetch countries
  await queryClient.prefetchQuery({
    ...getGetCountriesQueryOptions(GET_COUNTRIES_OPTIONS),
  });

  // Prefetch categories
  await queryClient.prefetchQuery({
    ...getGetCategoriesQueryOptions({
      "pagination[pageSize]": 100,
      populate: "datasets",
      sort: "name:asc",
      filters: {},
    }),
  });

  const CATEGORIES = queryClient.getQueryData<CategoryListResponse>(
    getGetCategoriesQueryKey({
      "pagination[pageSize]": 100,
      populate: "datasets",
      sort: "name:asc",
      filters: {},
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
        sort: "name:asc",
      }),
    });
  }

  // Prefetch projects

  await queryClient.prefetchQuery({
    ...getGetProjectsQueryOptions(GET_PROJECTS_OPTIONS("")),
  });

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
