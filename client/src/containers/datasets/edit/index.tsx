"use client";

import { useState, useCallback } from "react";

import type { Dataset } from "@/types/generated/strapi.schemas";

import { useParams } from "next/navigation";

import { useSyncDatasetStep } from "@/app/store";

import NewDatasetColorsForm from "@/components/forms/new-dataset/colors";
import NewDatasetDataForm from "@/components/forms/new-dataset/data";
import NewDatasetSettingsForm from "@/components/forms/new-dataset/settings";

import { useGetDatasetValuesId } from "@/types/generated/dataset-value";
import { useGetDatasetValues } from "@/types/generated/dataset-value";
import { usePostDatasets } from "@/types/generated/dataset";
import { useGetCategories, useGetCategoriesId } from "@/types/generated/category";

export interface Data {
  settings: {
    name: string;
    description: string;
    valueType?: Dataset["value_type"] | undefined;
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
  const params = useParams();
  const { id } = params;
  const [currentStep, setCurrentStep] = useSyncDatasetStep();
  const [formValues, setFormValues] = useState<Data>(DATA_INITIAL_VALUES);

  const { mutate } = usePostDatasets({
    mutation: {
      onSuccess: (data) => {
        console.log("Success creating dataset:", data);
        const searchParams = new URLSearchParams();
      },
      onError: (error) => {
        console.error("Error creating dataset:", error);
      },
    },
  });

  const { data: dataset } = useGetDatasetValuesId(Number(id));
  const { data: category } = useGetCategoriesId(Number(id));
  const { data: datasets } = useGetDatasetValues();
  const { data: categories } = useGetCategories();
  console.log(dataset, categories, "dataset");

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

  const handleSubmit = useCallback(() => {
    mutate({
      data: {
        dataset: {
          connect: [dataset.id],
        },
      },
    });
  }, []);

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
          data={formValues}
          onSubmit={handleSettingsSubmit}
        />
      )}
      {currentStep === 2 && (
        <NewDatasetDataForm
          id="edit-dataset-data"
          title="Edit dataset"
          data={formValues}
          onSubmit={handleDataSubmit}
        />
      )}
      {currentStep === 3 && (
        <NewDatasetColorsForm
          id="edit-dataset-colors"
          title="Edit dataset"
          data={formValues}
          onSubmit={handleColorsSubmit}
        />
      )}
    </>
  );
}
