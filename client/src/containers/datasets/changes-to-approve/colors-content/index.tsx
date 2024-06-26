"use client";

import { Dataset } from "@/types/generated/strapi.schemas";

import NewDatasetColorsForm from "@/components/forms/new-dataset/colors";
import type { Data } from "@/components/forms/new-dataset/types";
import ColorPicker from "@/components/ui/colorpicker";

export default function ColorsContentToApprove({
  data,
  id,
  changes,
  handleSubmit,
}: {
  data: Data;
  id: string;
  changes: string[];
  handleSubmit: (data: Data["colors"]) => void;
}) {
  const valueType = data?.settings?.valueType;
  const COLORS = {
    resource: { minValue: "#1b5eb6", maxValue: "#109484" },
    number: { minValue: "#1b5eb6", maxValue: "#109484" },
    boolean: { true: "#1b5eb6", false: "#109484" },
    text: [
      { cat1: "#1b5eb6" },
      { cat2: "#109484" },
      { cat3: "#7ea479" },
      { cat4: "#f9c74f" },
      { cat5: "#f3722c" },
      { cat6: "#f94144" },
    ],
  };

  return (
    <div className="flex items-center py-10 sm:px-10 md:px-24 lg:px-32">
      <div className="flex w-full justify-between space-x-10">
        <div className="flex w-full max-w-[368px] flex-1 flex-col justify-start">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="h-4 w-4 bg-green-400" />
              <span>New changes</span>
            </div>
            <p>
              {changes?.length > 0
                ? "Changes summary. Lorem ipsum dolor sit amet consectetur. Sit cursus sit pellentesque amet pellentesque tellus. Elit aliquam nec viverra egestas id ipsum vitae."
                : "No changes has been applied."}
            </p>
          </div>
        </div>

        <div className="flex w-full flex-1">
          <NewDatasetColorsForm
            id={id}
            header={false}
            title={`${data?.settings?.name} - Edit` || "Edit dataset"}
            data={data}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
