"use client";

import { useCallback, useMemo } from "react";

import { toast } from "react-toastify";

import { useParams, useRouter } from "next/navigation";

import { useAtom } from "jotai";
import { useSession } from "next-auth/react";

import { getDataParsed } from "@/lib/utils/datasets";

import { useGetDatasetsId } from "@/types/generated/dataset";
import {
  useGetDatasetEditSuggestionsId,
  usePostDatasetEditSuggestions,
  usePutDatasetEditSuggestionsId,
} from "@/types/generated/dataset-edit-suggestion";
import { useGetDatasetValues } from "@/types/generated/dataset-value";
import type { UsersPermissionsRole, UsersPermissionsUser } from "@/types/generated/strapi.schemas";
import { useGetUsersId } from "@/types/generated/users-permissions-users-roles";

import { datasetStepAtom, datasetValuesAtom, INITIAL_DATASET_VALUES } from "@/app/store";

import DatasetColorsForm from "@/components/forms/dataset/colors";
import DatasetDataForm from "@/components/forms/dataset/data";
import DatasetSettingsForm from "@/components/forms/dataset/settings";
import { Data } from "@/components/forms/dataset/types";

import { updateOrCreateDataset } from "@/services/datasets";

export default function EditDatasetForm() {
  const { data: session } = useSession();
  const { push } = useRouter();

  const params = useParams();
  const { id } = params;
  const [currentStep, setCurrentStep] = useAtom(datasetStepAtom);
  const [formValues, setFormValues] = useAtom(datasetValuesAtom);

  const { data: meData } = useGetUsersId(`${session?.user?.id}`, {
    populate: "role",
  });
  const ME_DATA = meData as UsersPermissionsUser & { role: UsersPermissionsRole };

  const { data: datasetData } = useGetDatasetsId(Number(id), {
    populate: "*",
  });

  const { data: datasetEditData } = useGetDatasetEditSuggestionsId(Number(id), {
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
      dataset_values: true,
    },
  });

  const { mutate: mutatePutDatasetEditSuggestionId } = usePutDatasetEditSuggestionsId({
    mutation: {
      onSuccess: (data) => {
        console.info("Success updating dataset:", data);
        push(`/dashboard`);
      },
      onError: (error) => {
        console.error("Error updating dataset:", error);
      },
    },
    request: {},
  });

  const { mutate: mutatePostDatasetEditSuggestion } = usePostDatasetEditSuggestions({
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
      value_type: datasetData?.data?.attributes?.value_type || undefined,
      category: datasetData?.data?.attributes?.category?.data?.id || undefined,
      unit: datasetData?.data?.attributes?.unit || undefined,
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

    const colors =
      (datasetData?.data?.attributes?.layers?.data || [])[0]?.attributes?.colors ||
      ({} as Data["colors"]);

    setFormValues({ settings, data, colors });
  }, [datasetData, datasetValuesData, setFormValues]);

  const handleSettingsSubmit = useCallback(
    (values: Data["settings"]) => {
      setFormValues({ ...formValues, settings: values });
      setCurrentStep(2);
    },
    [formValues, setFormValues, setCurrentStep],
  );

  const handleDataSubmit = useCallback(
    (values: Data["data"]) => {
      setFormValues({ ...formValues, data: values });
      setCurrentStep(3);
    },
    [formValues, setFormValues, setCurrentStep],
  );

  const handleColorsSubmit = useCallback(
    (values: Data["colors"]) => {
      const data = { ...formValues, colors: values };
      setFormValues(data);

      if (ME_DATA?.role?.type === "authenticated") {
        if (!id || (!!id && !datasetEditData)) {
          mutatePostDatasetEditSuggestion({
            data: {
              // @ts-expect-error TO-DO - fix types
              data: {
                ...data.settings,
                value_type: data.settings.value_type,
                review_status: "pending",
                colors: data.colors,
                data: {
                  ...data.data,
                },
                ...(id &&
                  !datasetEditData && {
                    dataset: {
                      connect: [+id],
                      disconnect: [],
                    },
                  }),
              },
            },
          });
        }

        if (!!id && !!datasetEditData) {
          const categoryId =
            typeof data.settings.category === "number"
              ? data.settings?.category
              : data?.settings?.category?.data?.id;

          mutatePutDatasetEditSuggestionId({
            id: +id,
            data: {
              data: {
                ...data.settings,
                value_type: data.settings.value_type,
                category: categoryId as number,
                review_status: "pending",
                colors: data.colors,
                data: {
                  ...data.data,
                },
              },
            },
          });
        }
      }

      if (ME_DATA?.role?.type === "admin" && session?.apiToken) {
        const { value_type } = data.settings;
        const parsedData = getDataParsed(value_type, data);
        updateOrCreateDataset(
          {
            ...(id && !datasetEditData && { dataset_id: id }),
            ...(id &&
              !!datasetEditData && {
                dataset_id: datasetData?.data?.attributes,
              }),
            ...parsedData,
          },
          session?.apiToken,
          // to do review data + change sug status
        )
          .then(() => {
            console.info("Success creating dataset:", data);
            toast.success("Success creating dataset");
            if (!!id && !!datasetEditData) {
              mutatePutDatasetEditSuggestionId({
                id: +id,
                data: {
                  data: {
                    ...data.settings,
                    value_type: data.settings.value_type,
                    category: datasetEditData?.data?.attributes?.category?.data?.id,
                    review_status: "approved",
                    colors: data.colors,
                    data: {
                      ...data.data,
                    },
                  },
                },
              });
            }
            setFormValues(INITIAL_DATASET_VALUES);
            push(`/`);
          })
          .catch((error: Error) => {
            if (error) {
              toast.error("There was a problem creating the dataset");
              console.error("Error creating dataset:", error);
            }
          });
      }
    },
    [
      formValues,
      setFormValues,
      ME_DATA?.role?.type,
      mutatePostDatasetEditSuggestion,
      datasetData?.data,
      datasetEditData,
      id,
      mutatePutDatasetEditSuggestionId,
      session?.apiToken,
      push,
    ],
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
