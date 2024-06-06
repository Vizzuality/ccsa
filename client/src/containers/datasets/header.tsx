"use client";

import { useCallback } from "react";

import { useSession } from "next-auth/react";

import { usePostDatasets } from "@/types/generated/dataset";

import { useSyncDatasets } from "@/app/store";

import { Button } from "@/components/ui/button";

const DatasetsHeader = () => {
  const [datasets] = useSyncDatasets();

  const { data: user } = useSession();

  const {
    mutate,
    // isLoading, isError, data, error
  } = usePostDatasets({
    mutation: {
      onSuccess: (data) => {
        console.log("Dataset created successfully:", data);
      },
      onError: (error) => {
        console.error("Error creating dataset:", error);
      },
    },
    request: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.apiToken}`,
      },
    },
  });

  const handleDatasets = useCallback(() => {
    mutate({
      data: {
        data: {
          name: "airline testing",
          category: 3,
          description: "new dataset description",
          value_type: "resource",
          unit: "unit",
          datum: [],
        },
      },
    });
  }, []);

  return (
    <header className="flex items-center justify-between">
      <p className="text-sm">All datasets</p>

      <div className="flex translate-y-0.5 items-center space-x-1.5 text-xxs">
        {user && (
          <Button size="sm" className="p-1 text-xxs" onClick={handleDatasets}>
            Add new
          </Button>
        )}
        <span className="font-semibold uppercase text-gray-400">Active layers:</span>
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 font-semibold">
          {datasets.length}
        </span>
      </div>
    </header>
  );
};

export default DatasetsHeader;
