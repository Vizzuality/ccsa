"use client";

import { FC } from "react";

import { Button } from "@/components/ui/button";

type NewDatasetFormControls = {
  id: string;
  title: string;
  handleCancel: () => void;
  description?: string;
};

export const NewDatasetFormControls: FC<NewDatasetFormControls> = ({
  title,
  id,
  handleCancel,
  description,
}: NewDatasetFormControls) => {
  return (
    <div className="flex w-full flex-col border-b border-gray-300/20  sm:px-10 md:px-24 lg:px-32">
      <div className="flex items-center justify-between py-4">
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
      {description && (
        <div className="align-center  m-auto flex w-full justify-center">
          <p className="align-left min-w-[384px]">{description}</p>
        </div>
      )}
    </div>
  );
};

export default NewDatasetFormControls;
