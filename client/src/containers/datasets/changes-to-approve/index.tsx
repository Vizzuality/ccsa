"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

import { usePathname } from "next/navigation";

import { useGetDatasetsId } from "@/types/generated/dataset";

import { useGetDatasetEditSuggestionsId } from "@/types/generated/dataset-edit-suggestion";
import SettingsContentToApprove from "./settings-content";
import DataContentToApprove from "./data-content";

import type { Dataset } from "@/types/generated/strapi.schemas";

function getObjectDifferences(obj1: Dataset, obj2: Dataset): (keyof Dataset)[] {
  if (!obj2) return [];

  const keys = new Set<keyof Dataset>([
    ...Object.keys(obj1),
    ...Object.keys(obj2),
  ] as (keyof Dataset)[]);

  const differences: (keyof Dataset)[] = [];

  keys.forEach((key) => {
    if (obj1[key] !== obj2[key]) {
      differences.push(key);
    }
  });

  return differences.length > 0 ? differences : [];
}

export default function FormToApprove() {
  const pathname = usePathname();

  const id = Number(pathname.split("/datasets/changes-to-approve/")[1]);
  const { data: DatasetToApprove } = useGetDatasetEditSuggestionsId(id);
  const { data: PreviousDataset } = useGetDatasetsId(27);
  const data = DatasetToApprove?.data?.attributes?.datum as Dataset;
  const previousDatasetsData = PreviousDataset?.data?.attributes as Dataset;

  const diffKeys = !!data && getObjectDifferences(data, previousDatasetsData);
  console.log(DatasetToApprove, "DatasetToApprove");
  return (
    <>
      <div className="flex items-center justify-between border-b border-gray-300/20 py-4  sm:px-10 md:px-24 lg:px-32">
        <h1 className="text-3xl font-bold -tracking-[0.0375rem]">{data?.name}</h1>
        <div className="flex items-center space-x-2 text-sm sm:flex-row">
          <Button size="sm" variant="primary-outline">
            Reject
          </Button>
          <Button size="sm">Approve</Button>
        </div>
      </div>
      <Tabs defaultValue="settings" className="w-full divide-y-2 divide-gray-300/20">
        <TabsList className="p-4 sm:px-10 md:px-24 lg:px-32">
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
          <TabsTrigger value="colors">Colors</TabsTrigger>
        </TabsList>
        <TabsContent value="settings">
          <SettingsContentToApprove data={data} changes={diffKeys} />
        </TabsContent>
        <TabsContent value="data">
          {" "}
          <DataContentToApprove data={data} changes={diffKeys} />
        </TabsContent>
        <TabsContent value="colors">colors</TabsContent>
      </Tabs>
    </>
  );
}
