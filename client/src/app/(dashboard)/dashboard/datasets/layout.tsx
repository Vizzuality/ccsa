import { dehydrate, Hydrate } from "@tanstack/react-query";

import getQueryClient from "@/lib/react-query/getQueryClient";

import { getGetCategoriesQueryOptions } from "@/types/generated/category";
import { getGetCountriesQueryOptions } from "@/types/generated/country";

import { GET_COUNTRIES_OPTIONS } from "@/constants/countries";
import { GET_CATEGORIES_OPTIONS } from "@/constants/datasets";

export default async function DashboardDatasetsLayout({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(getGetCountriesQueryOptions(GET_COUNTRIES_OPTIONS));

  await queryClient.prefetchQuery(getGetCategoriesQueryOptions(GET_CATEGORIES_OPTIONS()));

  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <main className="h-[100svh] w-full ">{children}</main>
    </Hydrate>
  );
}
