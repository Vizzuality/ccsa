"use client";

import { FC } from "react";

import { Button } from "@/components/ui/button";

type NewDatasetFormControls = {
  id: string;
  title: string;
  handleCancel: () => void;
};

export const NewDatasetFormControls: FC<NewDatasetFormControls> = ({
  title,
  id,
  handleCancel,
}: NewDatasetFormControls) => {
  return (
    <div className="flex items-center justify-between border-b border-gray-300/20 py-4 sm:px-10 md:px-24 lg:px-32">
      <h1 className="text-3xl font-bold -tracking-[0.0375rem]">{title}</h1>
      <div className="flex items-center space-x-2 text-sm sm:flex-row">
        <Button size="sm" variant="primary-outline" onClick={handleCancel}>
          Cancel
        </Button>

        <Button form={id} size="sm" type="submit">
          Continue
        </Button>
      </div>
    </div>
  );
};

export default NewDatasetFormControls;