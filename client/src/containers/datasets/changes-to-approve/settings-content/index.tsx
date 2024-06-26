"use client";

import { cn } from "@/lib/classnames";

import { Data } from "@/components/forms/new-dataset/types";

import { useRouter } from "next/navigation";
import { Dataset } from "@/types/generated/strapi.schemas";

import NewDatasetSettingsForm from "@/components/forms/new-dataset/settings";
import { NewDatasetFormControls } from "@/components/new-dataset/form-controls";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSyncSearchParams } from "@/app/store";

export default function SettingsContentToApprove({
  data,
  id,
  changes,
  handleSubmit,
}: {
  data: Data;
  id: string;
  changes: (keyof Data)[];
  handleSubmit: (data: Data["settings"]) => void;
}) {
  console.log(data);

  return (
    <>
      {/* <NewDatasetFormControls title={data?.settings?.name} id={id} handleCancel={handleCancel} /> */}
      <div className="flex items-center py-10 sm:px-10 md:px-24 lg:px-32">
        <div className="flex w-full justify-between space-x-10">
          <div className="flex w-full max-w-[368px] flex-1 flex-col justify-start">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="h-4 w-4 bg-green-400" />
                <span>New changes</span>
              </div>
              <p>
                <p>
                  {changes?.length > 0
                    ? "Changes summary. Lorem ipsum dolor sit amet consectetur. Sit cursus sit pellentesque amet pellentesque tellus. Elit aliquam nec viverra egestas id ipsum vitae."
                    : "No changes has been applied."}
                </p>
              </p>
            </div>
          </div>

          <NewDatasetSettingsForm
            id={id}
            title={data?.settings?.name}
            data={data}
            header={false}
            onSubmit={handleSubmit}
          />

          {/* <div className="w-full max-w-5xl flex-1 gap-4 sm:grid sm:grid-cols-2 md:gap-6">
          <div className="space-y-1.5">
            <span className="text-xs font-semibold">Name</span>
            <Input
              value={data?.name}
              className={cn({
                "border-none bg-gray-300/20 placeholder:text-gray-300/95": true,
                "bg-green-400": changes.length && changes?.includes("name"),
              })}
              placeholder={data?.name}
            />
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-semibold">Type of value</span>
            <Input
              value={data?.value_type}
              className="border-none bg-gray-300/20 placeholder:text-gray-300/95"
              placeholder={data?.value_type}
            />
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-semibold">Category</span>
            {/* TO - DO - find category name */}
          {/* <Input
              value={data?.category}
              className="border-none bg-gray-300/20 placeholder:text-gray-300/95"
              placeholder={data?.category}
            />
          </div>

          <div className="space-y-1.5">
            <span className="flex justify-between text-xs">
              <span className="font-semibold">Unit</span>
              <span className="text-gray-500">(optional)</span>
            </span>
            <Input
              value={data?.unit}
              className="border-none bg-gray-300/20 placeholder:text-gray-300/95"
              placeholder={data?.unit}
            />
          </div>

          <div className="col-span-2 space-y-1.5">
            <span className="text-xs font-semibold">Description</span>
            <Textarea
              value={data?.description}
              className="border-none bg-gray-300/20 placeholder:text-gray-300/95"
              placeholder={data?.description}
            />
          </div>
        </div> */}
        </div>
      </div>
    </>
  );
}
