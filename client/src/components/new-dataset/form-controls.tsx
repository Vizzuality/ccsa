"use client";

import { Button } from "@/components/ui/button";

import { useFormContext } from "react-hook-form";

import { z } from "zod";

export const NewDatasetFormControls = ({ onClick }) => {
  const formSchema = z.object({
    name: z.string().min(1, { message: "Please enter your name" }),
    valueType: z.string().email({ message: "Please enter your email address" }),
    category: z.string().min(1, { message: "Please enter your organization name" }),
    unit: z
      .string()
      .nonempty({ message: "Please enter your password" })
      .min(6, {
        message: "Please enter a password with at least 6 characters",
      })
      .optional(),
  });

  return (
    <div className="flex items-center space-x-2 text-sm sm:flex-row">
      <Button size="sm" variant="primary-outline">
        Cancel
      </Button>
      <Button onClick={onClick} size="sm">
        Continue
      </Button>
    </div>
  );
};
