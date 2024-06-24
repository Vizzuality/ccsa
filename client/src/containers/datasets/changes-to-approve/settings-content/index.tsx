"use client";

import { cn } from "@/lib/classnames";

import { Dataset } from "@/types/generated/strapi.schemas";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function SettingsContentToApprove({
  data,
  changes,
}: {
  data: Dataset;
  changes: (keyof Dataset)[];
}) {
  return (
    <div className="flex items-center justify-between py-10 sm:px-10 md:px-24 lg:px-32">
      <div className="grid grid-cols-2 gap-10">
        <div className="flex w-full flex-1 flex-col justify-start">
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

        <div className="w-full max-w-5xl gap-4 sm:grid sm:grid-cols-2 md:gap-6">
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
            <Input
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
        </div>
      </div>
    </div>
  );
}
