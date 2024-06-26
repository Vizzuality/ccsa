import { Metadata } from "next";

import { Hydrate, dehydrate } from "@tanstack/react-query";

import getQueryClient from "@/lib/react-query/getQueryClient";

import { getGetDatasetsIdQueryOptions } from "@/types/generated/dataset";
import { getGetDatasetValuesQueryOptions } from "@/types/generated/dataset-value";

import DatasetChangesToApprove from "@/containers/datasets/changes-to-approve";

export const metadata: Metadata = {
  title: "Changes to approve | Caribbean Climate smart map",
  description: "Generated by create next app",
};

export default async function ChangesToApprovePage({ params }: { params: { id: number } }) {
  const { id } = params;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(
    getGetDatasetsIdQueryOptions(id, {
      populate: "*",
    }),
  );

  await queryClient.prefetchQuery(
    getGetDatasetValuesQueryOptions({
      filters: {
        dataset: id,
      },
      "pagination[pageSize]": 300,
      populate: {
        country: {
          fields: ["name", "iso3"],
        },
        resources: true,
      },
    }),
  );

  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <DatasetChangesToApprove />
    </Hydrate>
  );
}
