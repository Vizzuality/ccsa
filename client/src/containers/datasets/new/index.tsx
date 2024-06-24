"use client";

import { useState, useCallback } from "react";

import { useAtom } from "jotai";

import type { Dataset } from "@/types/generated/strapi.schemas";

import { datasetFormStepAtom } from "@/app/store";

import NewDatasetColorsForm from "@/components/forms/new-dataset/colors";
import NewDatasetDataForm from "@/components/forms/new-dataset/data";
import NewDatasetSettingsForm from "@/components/forms/new-dataset/settings";
// import { usePostDatasets } from "@/types/generated/dataset";
// import { usePostDatasetEditSuggestions } from "@/types/generated/dataset-edit-suggestion";
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

  // const handleDataset = () => {
  //   mutateDatasetEditSuggestion({
  //     data: {
  //       data: {
  //         datum: [
  //           {
  //             iso3: "ABW",
  //             value: "High",
  //           },
  //           {
  //             iso3: "AIA",
  //             value: "High",
  //           },
  //           {
  //             iso3: "ATG",
  //             value: "Medium",
  //           },
  //           {
  //             iso3: "BES",
  //             value: "Medium",
  //           },
  //           {
  //             iso3: "BHS",
  //             value: "Medium",
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
      console.log("settings submit cambio de step");
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
      {/* <button onClick={handleDataset}>Create dataset</button> */}
      {currentStep === 1 && (
        <NewDatasetSettingsForm
          id="dataset-settings"
          title="New dataset"
          data={formValues.settings}
          onSubmit={handleSettingsSubmit}
        />
      )}
      {currentStep === 2 && (
        <NewDatasetDataForm
          id="dataset-data"
          title="New dataset"
          data={formValues.data}
          onSubmit={handleDataSubmit}
          valueType={formValues?.settings?.valueType}
        />
      )}
      {currentStep === 3 && (
        <NewDatasetColorsForm
          id="dataset-colors"
          title="New dataset"
          data={formValues.colors}
          categoriesData={formValues.data}
          onSubmit={handleColorsSubmit}
          valueType={formValues?.settings?.valueType}
        />
      )}
    </>
  );
}
