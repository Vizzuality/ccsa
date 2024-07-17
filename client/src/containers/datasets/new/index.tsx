"use client";

import { useCallback } from "react";

import { toast } from "react-toastify";

import { useRouter } from "next/navigation";

import { useAtom } from "jotai";
import { useSession } from "next-auth/react";

import { getDataParsed } from "@/lib/utils/datasets";

import { usePostDatasetEditSuggestions } from "@/types/generated/dataset-edit-suggestion";
import type { UsersPermissionsRole, UsersPermissionsUser } from "@/types/generated/strapi.schemas";
import { useGetUsersId } from "@/types/generated/users-permissions-users-roles";

import { datasetStepAtom, datasetValuesAtom, INITIAL_DATASET_VALUES } from "@/app/store";

import DatasetColorsForm from "@/components/forms/dataset/colors";
import DatasetDataForm from "@/components/forms/dataset/data";
import DatasetSettingsForm from "@/components/forms/dataset/settings";
import { Data } from "@/components/forms/dataset/types";

import { updateOrCreateDataset } from "@/services/datasets";

export default function NewDatasetForm() {
  const { data: session } = useSession();

  const { push } = useRouter();

  const [step, setStep] = useAtom(datasetStepAtom);
  const [formValues, setFormValues] = useAtom(datasetValuesAtom);

  const { data: meData } = useGetUsersId(`${session?.user?.id}`, {
    populate: "role",
  });
  const ME_DATA = meData as UsersPermissionsUser & { role: UsersPermissionsRole };

  // contributor role can just suggest changes
  const { mutate: mutatePostDatasetEditSuggestion } = usePostDatasetEditSuggestions({
    mutation: {
      onSuccess: (data) => {
        console.info("Success creating dataset:", data);
        push(`/dashboard`);
        setStep(1);
      },
      onError: (error: Error) => {
        console.error("Error creating dataset:", error);
      },
    },
    request: {},
  });

  const handleSettingsSubmit = useCallback(
    (values: Data["settings"]) => {
      setFormValues({ ...formValues, settings: values });
      setStep(2);
    },
    [formValues, setFormValues, setStep],
  );

  const handleDataSubmit = useCallback(
    (values: Data["data"]) => {
      setFormValues({ ...formValues, data: values });
      setStep(3);
    },
    [formValues, setFormValues, setStep],
  );

  const handleColorsSubmit = useCallback(
    (values: Data["colors"]) => {
      const data = { ...formValues, colors: values };
      setFormValues(data);

      if (ME_DATA?.role?.type === "authenticated") {
        mutatePostDatasetEditSuggestion({
          data: {
            data: {
              ...data.settings,
              value_type: data.settings.value_type,
              data: data.data,
              colors: data.colors,
              review_status: "pending",
              // @ts-expect-error TO-DO - fix types
              categories: {
                connect: [values.categories],
                disconnect: [],
              },
            },
          },
        });
      }

      if (ME_DATA?.role?.type === "admin") {
        const { value_type } = data.settings;
        const parsedData = getDataParsed(value_type, data);
        updateOrCreateDataset(parsedData, session?.apiToken as string)
          .then(() => {
            console.info("Success creating dataset:", data);
            toast.success("Success creating dataset");

            setFormValues(INITIAL_DATASET_VALUES);
            push(`/`);
            setStep(1);
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
      ME_DATA,
      mutatePostDatasetEditSuggestion,
      session?.apiToken,
      push,
      setStep,
    ],
  );

  return (
    <>
      {step === 1 && (
        <DatasetSettingsForm
          id="dataset-settings"
          title="New dataset"
          data={formValues}
          onSubmit={handleSettingsSubmit}
        />
      )}
      {step === 2 && (
        <DatasetDataForm
          id="dataset-data"
          title="New dataset"
          data={formValues}
          onSubmit={handleDataSubmit}
        />
      )}
      {step === 3 && (
        <DatasetColorsForm
          id="dataset-colors"
          title="New dataset"
          data={formValues}
          onSubmit={handleColorsSubmit}
        />
      )}
    </>
  );
}
