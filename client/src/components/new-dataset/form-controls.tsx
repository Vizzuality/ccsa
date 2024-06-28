"use client";

import { FC } from "react";

import { Button } from "@/components/ui/button";

type DashboardFormControls = {
  id: string;
  title: string;
  handleCancel: () => void;
};

export const DashboardFormControls: FC<DashboardFormControls> = ({
  title,
  id,
  handleCancel,
}: DashboardFormControls) => {
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
    </div>
  );
};

export default DashboardFormControls;
