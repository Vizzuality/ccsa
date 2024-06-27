"use client";

import { useState, useCallback, useMemo } from "react";

import { useParams, useRouter } from "next/navigation";

import { useSession } from "next-auth/react";

import { useGetDatasetsId } from "@/types/generated/dataset";
import { usePostDatasetEditSuggestions } from "@/types/generated/dataset-edit-suggestion";
import { useGetDatasetValues } from "@/types/generated/dataset-value";
import type { UsersPermissionsRole, UsersPermissionsUser } from "@/types/generated/strapi.schemas";
import { useGetUsersId } from "@/types/generated/users-permissions-users-roles";

import { useSyncDatasetStep } from "@/app/store";

import { DATA_INITIAL_VALUES } from "@/containers/datasets/new";

import DatasetColorsForm from "@/components/forms/new-dataset/colors";
import DatasetDataForm from "@/components/forms/new-dataset/data";
import DatasetSettingsForm from "@/components/forms/new-dataset/settings";
import { Data } from "@/components/forms/new-dataset/types";

export default function EditDatasetForm() {
  const { data: session } = useSession();
  const { push } = useRouter();

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
        push(`/dashboard`);
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
        <DatasetSettingsForm
          id="edit-dataset-settings"
          title={`${datasetData?.data?.attributes?.name} - Edit` || "Edit dataset"}
          data={formValues}
          onSubmit={handleSettingsSubmit}
        />
      )}
      {currentStep === 2 && (
        <DatasetDataForm
          id="edit-dataset-data"
          title={`${datasetData?.data?.attributes?.name} - Edit` || "Edit dataset"}
          data={formValues}
          onSubmit={handleDataSubmit}
        />
      )}
      {currentStep === 3 && (
        <DatasetColorsForm
          id="edit-dataset-colors"
          title={`${datasetData?.data?.attributes?.name} - Edit` || "Edit dataset"}
          data={formValues}
          onSubmit={handleColorsSubmit}
        />
      )}
    </>
  );
}
