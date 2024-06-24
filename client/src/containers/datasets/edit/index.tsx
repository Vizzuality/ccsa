"use client";

import { useState, useCallback } from "react";

import type { Dataset } from "@/types/generated/strapi.schemas";

import { useSyncDatasetStep } from "@/app/store";

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

export default function EditDatasetForm() {
  // const { replace } = useRouter();
  const [currentStep, setCurrentStep] = useSyncDatasetStep();
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
        <NewDatasetSettingsForm
          id="edit-dataset-settings"
          title="Edit dataset"
          data={formValues.settings}
          onSubmit={handleSettingsSubmit}
        />
      )}
      {currentStep === 2 && (
        <NewDatasetDataForm
          id="edit-dataset-data"
          title="Edit dataset"
          data={formValues.data}
          onSubmit={handleDataSubmit}
          valueType={formValues?.settings?.valueType}
        />
      )}
      {currentStep === 3 && (
        <NewDatasetColorsForm
          id="edit-dataset-colors"
          title="Edit dataset"
          data={formValues.colors}
          categoriesData={formValues.data}
          onSubmit={handleColorsSubmit}
          valueType={formValues?.settings?.valueType}
        />
      )}
    </>
  );
}
