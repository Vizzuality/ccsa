"use client";

import { cn } from "@/lib/classnames";

import { Dataset } from "@/types/generated/strapi.schemas";
import ColorPicker from "@/components/ui/colorpicker";

import { VALUE_TYPE } from "@/components/forms/new-dataset/types";

export default function ColorsContentToApprove({
  data,
  changes,
  valueType,
  categories,
}: {
  data: Dataset;
  changes: (keyof Dataset)[];
  valueType: VALUE_TYPE;
  categories?: string[];
}) {
  console.log(data, categories, valueType);
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
          <div className="grid grid-cols-2 gap-6">
            {/* {valueType === "number" && <DynamicForm form={form} />} */}
            {(valueType === "resource" || valueType === "text") &&
              categories?.map((category) => (
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold">{category}</span>
                  <div>
                    <ColorPicker
                      id="color"
                      value={"field.value"}
                      onChange={(e) => {
                        return console.log(e.target.value);
                      }}
                    />
                  </div>
                </div>
              ))}

            {valueType === "boolean" && (
              <>
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold">Value for TRUE</span>
                  <div>
                    <ColorPicker
                      id="color"
                      value={"field.value"}
                      onChange={(e) => {
                        return console.log(e.target.value);
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-semibold">Value for FALSE</span>
                  <div>
                    <ColorPicker
                      id="color"
                      value={"field.value"}
                      onChange={(e) => {
                        return console.log(e.target.value);
                      }}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
