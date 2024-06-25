"use client";

import type { Data } from "@/components/forms/new-dataset/types";
import { Dataset } from "@/types/generated/strapi.schemas";

import ColorPicker from "@/components/ui/colorpicker";

export default function ColorsContentToApprove({
  data,
  changes,
}: {
  data: Data;
  changes: (keyof Dataset)[];
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
              <p>
                {changes?.length > 0
                  ? "Changes summary. Lorem ipsum dolor sit amet consectetur. Sit cursus sit pellentesque amet pellentesque tellus. Elit aliquam nec viverra egestas id ipsum vitae."
                  : "No changes has been applied."}
              </p>
            </p>
          </div>
        </div>

        <div className="flex w-full flex-1">
          {/* <NewDatasetColorsForm
            id="edit-dataset-colors"
            title={data?.title || "Edit dataset"}
            data={data}
            // onSubmit={handleColorsSubmit}
          /> */}
          <div className="grid w-full grow grid-cols-2 gap-6">
            {valueType === "text" &&
              // categories?.map((category) => (
              //   <div className="space-y-1.5 min-w-fit">
              //     <span className="text-xs font-semibold">{category}</span>
              //     <div>
              //       <ColorPicker
              //         id="color"
              //         value={"field.value"}
              //         onChange={(e) => {
              //           return console.log(e.target.value);
              //         }}
              //       />
              //     </div>
              //   </div>
              // ))

              COLORS["text"]?.map((category) => (
                <div className=" space-y-1.5">
                  <span className="text-xs font-semibold">{Object.keys(category)}</span>
                  <div>
                    <ColorPicker
                      id="color"
                      value={Object.values(category)}
                      onChange={(e) => {
                        return console.log(e.target.value);
                      }}
                    />
                  </div>
                </div>
              ))}

            {valueType === "number" ||
              (valueType === "resource" && (
                <>
                  <div className="min-w-fit space-y-1.5">
                    <span className="text-xs font-semibold">Value for TRUE</span>
                    <div>
                      <ColorPicker
                        id="color"
                        value={COLORS[valueType].minValue}
                        onChange={(e) => {
                          return console.log(e.target.value);
                        }}
                      />
                    </div>
                  </div>

                  <div className="min-w-fit space-y-1.5">
                    <span className="text-xs font-semibold">Value for FALSE</span>
                    <div>
                      <ColorPicker
                        id="color"
                        value={COLORS[valueType].maxValue}
                        onChange={(e) => {
                          return console.log(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                </>
              ))}

            {valueType === "boolean" && (
              <>
                <div className="min-w-fit space-y-1.5">
                  <span className="text-xs font-semibold">Value for TRUE</span>
                  <div>
                    <ColorPicker
                      id="color"
                      value={COLORS[valueType].true}
                      onChange={(e) => {
                        return console.log(e.target.value);
                      }}
                    />
                  </div>
                </div>

                <div className="min-w-fit space-y-1.5">
                  <span className="text-xs font-semibold">Value for FALSE</span>
                  <div>
                    <ColorPicker
                      id="color"
                      value={COLORS[valueType].false}
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
