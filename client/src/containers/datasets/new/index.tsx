"use client";

import { useState, useCallback } from "react";

// import { usePostDatasets } from "@/types/generated/dataset";
import { useRouter } from "next/navigation";

import { useSession } from "next-auth/react";

import { usePostDatasetEditSuggestions } from "@/types/generated/dataset-edit-suggestion";
// import { usePostDatasetValues } from "@/types/generated/dataset-value";
import type { UsersPermissionsRole, UsersPermissionsUser } from "@/types/generated/strapi.schemas";
import { useGetUsersId } from "@/types/generated/users-permissions-users-roles";

import { useSyncDatasetStep } from "@/app/store";

import DatasetColorsForm from "@/components/forms/dataset/colors";
import DatasetDataForm from "@/components/forms/dataset/data";
import DatasetSettingsForm from "@/components/forms/dataset/settings";
import { Data } from "@/components/forms/dataset/types";

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

export const DATA_HARCODED_VALUES: Data = {
  // type resource
  settings: {
    name: "Test",
    description: "Test description",
    valueType: "resource",
    category: 1,
    unit: "test",
  },
  data: {
    AIA: [
      {
        title: "Resource title",
        description: "Resource description",
        link: "http://google.com",
      },
      {
        title: "Resource title",
        description: "Resource description",
        link: "http://google.com",
      },
    ],
    BRB: [
      {
        title: "Resource title",
        description: "Resource description",
        link: "http://google.com",
      },
    ],
    BES: [
      {
        title: "Resource title",
        description: "Resource description",
        link: "http://google.com",
      },
    ],
  },
  colors: {},
};

export default function NewDatasetForm() {
  const { data: session } = useSession();

  const { push } = useRouter();

  const [step, setStep] = useSyncDatasetStep();

  const [formValues, setFormValues] = useState<Data>(DATA_HARCODED_VALUES);

  const { data: meData } = useGetUsersId(`${session?.user?.id}`, {
    populate: "role",
  });
  const ME_DATA = meData as UsersPermissionsUser & { role: UsersPermissionsRole };

  // UsersPermissionsRole

  // const { mutate: mutateDataset } = usePostDatasets({
  //   mutation: {
  //     onSuccess: (data) => {
  //       console.log("Success creating dataset:", data);
  //     },
  //     onError: (error) => {
  //       console.error("Error creating dataset:", error);
  //     },
  //   },
  // });

  // const { mutate: mutateDatasetValues } = usePostDatasetValues({
  //   mutation: {
  //     onSuccess: (data) => {
  //       console.log("Success creating dataset values:", data);
  //     },
  //     onError: (error) => {
  //       console.error("Error creating dataset values:", error);
  //     },
  //   },
  // });

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

  const handleSettingsSubmit = useCallback(
    (values: Data["settings"]) => {
      setFormValues({ ...formValues, settings: values });
      setStep(2);
    },
    [formValues, setStep],
  );

  const handleDataSubmit = useCallback(
    (values: Data["data"]) => {
      setFormValues({ ...formValues, data: values });
      setStep(3);
    },
    [formValues, setStep],
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
            },
          },
        });
      }

      // BULK UPLOAD REQUIRED
      // if (ME_DATA?.role?.type === "admin") {
      //   mutateDataset({
      //     data: {
      //       data: {
      //         ...data.settings,
      //         review_status: "approved",
      //       },
      //     },
      //   });
      //   mutateDatasetValues({
      //     data: {
      //       data: {
      //         ...data.data,
      //       },
      //     },
      //   });
      // }
    },
    [formValues, ME_DATA, mutateDatasetEditSuggestion],
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
