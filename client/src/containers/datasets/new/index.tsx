"use client";

import { useState, useCallback } from "react";

import { useAtom } from "jotai";

import type { Dataset } from "@/types/generated/strapi.schemas";

import { datasetFormStepAtom } from "@/app/store";

import NewDatasetColorsForm from "@/components/forms/new-dataset/colors";
import NewDatasetDataForm from "@/components/forms/new-dataset/data";
import NewDatasetSettingsForm from "@/components/forms/new-dataset/settings";
// import { usePostDatasets } from "@/types/generated/dataset";

export interface Data {
  settings: {
    name: string;
    description: string;
    valueType: Dataset["value_type"] | undefined;
    category?: number;
    unit?: string;
  };
  data: { [key: string]: string | number };
  colors: Record<string, string>;
}

export const DATA_INITIAL_VALUES: Data = {
  settings: {
    name: "",
    description: "",
    valueType: undefined,
    category: undefined,
    unit: "",
  },
  data: {},
  colors: {},
};

export default function NewDatasetForm() {
  // const { replace } = useRouter();
  const [currentStep, setCurrentStep] = useAtom(datasetFormStepAtom);
  const [formValues, setFormValues] = useState<Data>(DATA_INITIAL_VALUES);

  // const { mutate } = usePostDatasets({
  //   mutation: {
  //     onSuccess: (data) => {
  //       console.log("Success creating dataset:", data);
  //       const searchParams = new URLSearchParams();
  //       replace(`/signin?${searchParams.toString()}`);
  //     },
  //     onError: (error) => {
  //       console.error("Error creating dataset:", error);
  //     },
  //   },
  // });

  // const { mutate: mutateDatasetEditSuggestion } = usePostDatasetEditSuggestions({
  //   mutation: {
  //     onSuccess: (data) => {
  //       console.log("Success creating dataset:", data);
  //     },
  //     onError: (error) => {
  //       console.error("Error creating dataset:", error);
  //     },
  //   },
  //   request: {},
  // });

  // 2. Define a submit handler.
  // function onSubmit(values) {
  //   // const fieldsToUpdate = form.formState.dirtyFields;

  //   mutate({ data: { email: values.email } });
  // }

  // const handleDataset = () => {
  //   mutateDatasetEditSuggestion({
  //     data: {
  //       data: {
  //         datum: [
  //           {
  //             iso3: "ABW",
  //             value: 8.069999694824219,
  //             color: {
  //               minValue: "#f7f7f7",
  //               maxValue: "#084594",
  //             },
  //           },
  //           {
  //             iso3: "AIA",
  //             value: 9.59000015258789,
  //           },
  //           {
  //             iso3: "ATG",
  //             value: 4.829999923706055,
  //           },
  //           {
  //             iso3: "BES",
  //             value: 5.139999866485596,
  //           },
  //           {
  //             iso3: "BHS",
  //             value: 6.130000114440918,
  //           },
  //           {
  //             iso3: "BLZ",
  //             value: 1.7699999809265137,
  //           },
  //           {
  //             iso3: "BMU",
  //             value: 8.569999694824219,
  //           },
  //           {
  //             iso3: "BRB",
  //             value: 3.9200000762939453,
  //           },
  //           {
  //             iso3: "CRI",
  //             value: 1.5499999523162842,
  //           },
  //           {
  //             iso3: "CUW",
  //             value: 11.899999618530273,
  //           },
  //           {
  //             iso3: "CYM",
  //             value: 7.019999980926514,
  //           },
  //           {
  //             iso3: "DMA",
  //             value: 2.2100000381469727,
  //           },
  //           {
  //             iso3: "DOM",
  //             value: 2.690000057220459,
  //           },
  //           {
  //             iso3: "GLP",
  //             value: 5.650000095367432,
  //           },
  //           {
  //             iso3: "GRD",
  //             value: 2.8499999046325684,
  //           },
  //           {
  //             iso3: "GUY",
  //             value: 3.940000057220459,
  //           },
  //           {
  //             iso3: "HND",
  //             value: 1.1200000047683716,
  //           },
  //           {
  //             iso3: "HTI",
  //             value: 0.25999999046325684,
  //           },
  //           {
  //             iso3: "JAM",
  //             value: 2.609999895095825,
  //           },
  //           {
  //             iso3: "KNA",
  //             value: 4.5,
  //           },
  //           {
  //             iso3: "LCA",
  //             value: 2.6600000858306885,
  //           },
  //           {
  //             iso3: "MEX",
  //             value: 3.2300000190734863,
  //           },
  //           {
  //             iso3: "MSR",
  //             value: 3.5,
  //           },
  //           {
  //             iso3: "PAN",
  //             value: 3.069999933242798,
  //           },
  //           {
  //             iso3: "SUR",
  //             value: 4.800000190734863,
  //           },
  //           {
  //             iso3: "TCA",
  //             value: 7.659999847412109,
  //           },
  //           {
  //             iso3: "TTO",
  //             value: 25.899999618530273,
  //           },
  //           {
  //             iso3: "VCT",
  //             value: 2.130000114440918,
  //           },
  //           {
  //             iso3: "VGB",
  //             value: 5.28000020980835,
  //           },
  //           {
  //             iso3: "VIR",
  //             value: 21.049999237060547,
  //           },
  //         ],
  //         description: "test dataset description",
  //         name: "test 3 dataset name",
  //         review_status: "declined",
  //         unit: "",
  //         value_type: "number",
  //       },
  //     },
  //   });
  // };

  const handleSettingsSubmit = useCallback(
    (values: Data["settings"]) => {
      setFormValues({ ...formValues, settings: values });
      setCurrentStep(2);
    },
    [formValues, setCurrentStep],
  );

  const handleDataSubmit = useCallback(
    (values: Data["data"]) => {
      setFormValues({ ...formValues, data: values });
      setCurrentStep(3);
    },
    [formValues, setCurrentStep],
  );

  const handleColorsSubmit = useCallback(
    (values: Data["colors"]) => {
      setFormValues({ ...formValues, colors: values });
      // TO - DO mutation to datasetEditsuggestion
    },
    [formValues],
  );

  return (
    <>
      {currentStep === 1 && (
        <NewDatasetSettingsForm data={formValues.settings} onSubmit={handleSettingsSubmit} />
      )}
      {currentStep === 2 && (
        <NewDatasetDataForm
          data={formValues.data}
          onSubmit={handleDataSubmit}
          valueType={formValues?.settings?.valueType}
        />
      )}
      {currentStep === 3 && (
        <NewDatasetColorsForm
          data={formValues.colors}
          categories={formValues.data}
          onSubmit={handleColorsSubmit}
          valueType={formValues?.settings?.valueType}
        />
      )}
    </>
  );
}
