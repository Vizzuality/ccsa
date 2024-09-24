import { PropsWithChildren } from "react";

import { headers } from "next/headers";

import { Hydrate, dehydrate } from "@tanstack/react-query";

import getQueryClient from "@/lib/react-query/getQueryClient";

import { getGetCategoriesQueryKey, getGetCategoriesQueryOptions } from "@/types/generated/category";
import { getGetCollaboratorsQueryOptions } from "@/types/generated/collaborator";
import { getGetCountriesQueryOptions } from "@/types/generated/country";
import { getGetDatasetsQueryOptions } from "@/types/generated/dataset";
import { getGetPillarsQueryOptions } from "@/types/generated/pillar";
import { getGetProjectsQueryOptions } from "@/types/generated/project";
import { getGetSdgsQueryOptions } from "@/types/generated/sdg";
import { CategoryListResponse } from "@/types/generated/strapi.schemas";

import { countriesParser, pillarsParser } from "@/app/parsers";

import { GET_COUNTRIES_OPTIONS } from "@/constants/countries";
import { GET_CATEGORIES_OPTIONS, GET_DATASETS_OPTIONS } from "@/constants/datasets";
import { GET_PILLARS_OPTIONS } from "@/constants/pillars";
import { GET_PROJECTS_OPTIONS } from "@/constants/projects";
import { GET_SDGs_OPTIONS } from "@/constants/sdgs";

import Map from "@/containers/map";

import LayoutProviders from "./layout-providers";

export default async function EmbedLayout({ children }: PropsWithChildren) {
  const url = new URL(headers().get("x-url")!);
  const searchParams = url.searchParams;

  const queryClient = getQueryClient();

  // Prefetch countries
  await queryClient.prefetchQuery(getGetCountriesQueryOptions(GET_COUNTRIES_OPTIONS));

  // Prefetch categories
  await queryClient.prefetchQuery(
    getGetCategoriesQueryOptions(GET_CATEGORIES_OPTIONS("", searchParams.get("preview") || "")),
  );

  const CATEGORIES = queryClient.getQueryData<CategoryListResponse>(
    getGetCategoriesQueryKey(GET_CATEGORIES_OPTIONS("", searchParams.get("preview") || "")),
  );

  for (const category of CATEGORIES?.data || []) {
    if (!category.id) continue;

    // Prefetch datasets
    await queryClient.prefetchQuery(
      getGetDatasetsQueryOptions(
        GET_DATASETS_OPTIONS("", category.id, searchParams.get("preview") || ""),
      ),
    );
  }

  // Prefetch projects
  await queryClient.prefetchQuery(
    getGetProjectsQueryOptions(
      GET_PROJECTS_OPTIONS("", {
        pillars: pillarsParser.parseServerSide(searchParams.get("pillars") || []),
        countries: countriesParser.parseServerSide(searchParams.get("countries") || []),
      }),
    ),
  );

  // Prefetch pillars
  await queryClient.prefetchQuery(getGetPillarsQueryOptions(GET_PILLARS_OPTIONS));

  // Prefetch sdgs
  await queryClient.prefetchQuery(getGetSdgsQueryOptions(GET_SDGs_OPTIONS));

  // Prefetch collaborators
  await queryClient.prefetchQuery(getGetCollaboratorsQueryOptions());

  const dehydratedState = dehydrate(queryClient);

  return (
    <LayoutProviders>
      <Hydrate state={dehydratedState}>
        <main className="flex h-[100svh] w-full justify-between">
          {children}
          <Map embed />
        </main>
      </Hydrate>
    </LayoutProviders>
  );
}
