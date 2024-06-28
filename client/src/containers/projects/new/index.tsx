"use client";

// import { useCallback } from "react";

// import { useForm } from "react-hook-form";

import {
  // useParams,
  useRouter,
} from "next/navigation";

import { useSyncSearchParams } from "@/app/store";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";

// import { cn } from "@/lib/classnames";

import NewDatasetDataFormWrapper from "@/components/forms/dataset/wrapper";
import DashboardFormControls from "@/components/new-dataset/form-controls";

export default function NewProjectForm() {
  const { push } = useRouter();
  const URLParams = useSyncSearchParams();

  // const params = useParams();

  const handleCancel = () => {
    push(`/?${URLParams.toString()}`);
  };

  // const handleSubmit = useCallback((values: z.infer<typeof formSchema>) => {
  //   // Save this into useState
  //   console.log(values);
  // }, []);

  return (
    <>
      <DashboardFormControls
        title="New project"
        id="collaborators-create"
        handleCancel={handleCancel}
      />
      <NewDatasetDataFormWrapper header={true}>
        <p className="m-auto w-full max-w-sm">Fill the organization&apos;s information</p>
        {/* <Form {...form}>
          <form
            id="collaborators-create"
            className="space-y-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <fieldset className="m-auto w-full max-w-sm space-y-6">
        
      
            </fieldset>
            <Button type="submit" className="hidden">
              Submit
            </Button>
          </form>
        </Form> */}
      </NewDatasetDataFormWrapper>
    </>
  );
}
