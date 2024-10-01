import { Metadata } from "next";

import Link from "next/link";

import { Hydrate, dehydrate } from "@tanstack/react-query";

import getQueryClient from "@/lib/react-query/getQueryClient";

import { getGetDatasetsIdQueryOptions } from "@/types/generated/dataset";
import {
  getGetDatasetEditSuggestionsIdQueryKey,
  getGetDatasetEditSuggestionsIdQueryOptions,
} from "@/types/generated/dataset-edit-suggestion";
import { getGetDatasetValuesQueryOptions } from "@/types/generated/dataset-value";
import { DatasetEditSuggestionResponse } from "@/types/generated/strapi.schemas";

import DatasetChangesToApprove from "@/containers/datasets/changes-to-approve";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export const metadata: Metadata = {
  title: "Changes to approve | Caribbean Climate smart map",
  description: "Generated by create next app",
  viewport: "width=1000, initial-scale=1",
};

export default async function ChangesToApprovePage({ params }: { params: { id: number } }) {
  const { id } = params;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(
    getGetDatasetEditSuggestionsIdQueryOptions(id, {
      populate: "*",
    }),
  );

  const ds = queryClient.getQueryData<DatasetEditSuggestionResponse>(
    getGetDatasetEditSuggestionsIdQueryKey(id, { populate: "*" }),
  );

  const datasetId = ds?.data?.attributes?.dataset?.data?.id;

  if (datasetId) {
    await queryClient.prefetchQuery(
      getGetDatasetsIdQueryOptions(
        datasetId,
        {
          populate: "*",
        },
        {
          query: {
            enabled: !!datasetId,
          },
        },
      ),
    );

    await queryClient.prefetchQuery(
      getGetDatasetValuesQueryOptions(
        {
          filters: {
            dataset: datasetId,
          },
          "pagination[pageSize]": 300,
          populate: {
            country: {
              fields: ["name", "iso3"],
            },
            resources: true,
          },
        },
        {
          query: {
            enabled: !!datasetId,
          },
        },
      ),
    );
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
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
              <BreadcrumbPage>Suggested changes</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <DatasetChangesToApprove />
    </Hydrate>
  );
}
