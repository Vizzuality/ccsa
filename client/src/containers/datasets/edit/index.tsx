"use client";

import { useState, useCallback, useMemo } from "react";

import { useParams, useRouter } from "next/navigation";

import { useGetDatasetsId } from "@/types/generated/dataset";
import { useGetDatasetValues } from "@/types/generated/dataset-value";

import { useSyncDatasetStep } from "@/app/store";

import { usePostDatasetEditSuggestions } from "@/types/generated/dataset-edit-suggestion";

import { useSession } from "next-auth/react";

import { useGetUsersId } from "@/types/generated/users-permissions-users-roles";

import NewDatasetColorsForm from "@/components/forms/new-dataset/colors";
import NewDatasetDataForm from "@/components/forms/new-dataset/data";
import NewDatasetSettingsForm from "@/components/forms/new-dataset/settings";
import { Data } from "@/components/forms/new-dataset/types";
import type { UsersPermissionsRole, UsersPermissionsUser } from "@/types/generated/strapi.schemas";

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
  const { data: session } = useSession();
  const { replace } = useRouter();

  const params = useParams();
  const { id } = params;
  const [currentStep, setCurrentStep] = useSyncDatasetStep();
  const [formValues, setFormValues] = useState<Data>(DATA_INITIAL_VALUES);

  const { data: meData } = useGetUsersId(`${session?.user?.id}`, {
    populate: "role",
  });
  const ME_DATA = meData as UsersPermissionsUser & { role: UsersPermissionsRole };

  const { data: datasetData } = useGetDatasetsId(Number(id), {
    populate: "*",
  });

  const { data: datasetValuesData } = useGetDatasetValues({
    filters: {
      dataset: id,
    },
    "pagination[pageSize]": 300,
    populate: {
      country: {
        fields: ["name", "iso3"],
      },
      resources: true,
    },
  });

  const { mutate: mutateDatasetEditSuggestion } = usePostDatasetEditSuggestions({
    mutation: {
      onSuccess: (data) => {
        console.info("Success creating dataset:", data);
        replace(`/dashboard`);
      },
      onError: (error) => {
        console.error("Error creating dataset:", error);
      },
    },
    request: {},
  });

  useMemo(() => {
    const settings = {
      name: datasetData?.data?.attributes?.name || "",
      description: datasetData?.data?.attributes?.description || "",
      valueType: datasetData?.data?.attributes?.value_type || undefined,
      category: datasetData?.data?.attributes?.category?.data?.id || undefined,
      unit: datasetData?.data?.attributes?.unit,
    };

    const data =
      datasetValuesData?.data?.reduce(
        (acc, curr) => {
          const countryIso = curr?.attributes?.country?.data?.attributes?.iso3;

          if (datasetData?.data?.attributes?.value_type === "number") {
            return { ...acc, [`${countryIso}`]: curr?.attributes?.value_number };
          }

          if (datasetData?.data?.attributes?.value_type === "text") {
            return { ...acc, [`${countryIso}`]: curr?.attributes?.value_text };
          }

          if (datasetData?.data?.attributes?.value_type === "boolean") {
            return { ...acc, [`${countryIso}`]: curr?.attributes?.value_boolean };
          }

          return acc;
        },
        {} as Data["data"],
      ) || {};

    const colors = {};

    setFormValues({ settings, data, colors });
  }, [datasetData, datasetValuesData]);

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
      const data = { ...formValues, colors: values };
      setFormValues(data);

      if (ME_DATA?.role?.type === "authenticated") {
        mutateDatasetEditSuggestion({
          data: {
            data: {
              ...data.settings,
              value_type: data.settings.valueType,
              data: data.data,
              colors: data.colors,
              review_status: "pending",
              dataset: +id,
            },
          },
        });
      }
    },
    [formValues],
  );

  return (
    <>
      {currentStep === 1 && (
        <NewDatasetSettingsForm
          id="edit-dataset-settings"
          title={`${datasetData?.data?.attributes?.name} - Edit` || "Edit dataset"}
          data={formValues}
          onSubmit={handleSettingsSubmit}
        />
      )}
      {currentStep === 2 && (
        <NewDatasetDataForm
          id="edit-dataset-data"
          title={`${datasetData?.data?.attributes?.name} - Edit` || "Edit dataset"}
          data={formValues}
          onSubmit={handleDataSubmit}
        />
      )}
      {currentStep === 3 && (
        <NewDatasetColorsForm
          id="edit-dataset-colors"
          title={`${datasetData?.data?.attributes?.name} - Edit` || "Edit dataset"}
          data={formValues}
          onSubmit={handleColorsSubmit}
        />
      )}
    </>
  );
}
