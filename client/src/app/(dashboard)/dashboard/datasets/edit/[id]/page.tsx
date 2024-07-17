import { Metadata } from "next";
import Link from "next/link";

import { Hydrate, dehydrate } from "@tanstack/react-query";

import getQueryClient from "@/lib/react-query/getQueryClient";

import { getGetDatasetsIdQueryOptions } from "@/types/generated/dataset";
import { getGetDatasetValuesQueryOptions } from "@/types/generated/dataset-value";

import EditDatasetForm from "@/containers/datasets/edit";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export const metadata: Metadata = {
  title: "Edit dataset form | Caribbean Climate smart map",
  description: "Generated by create next app",
};

export default async function EditDatasetPage({ params }: { params: { id: number } }) {
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
              <BreadcrumbPage>Edit dataset</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <EditDatasetForm />
    </Hydrate>
  );
}
