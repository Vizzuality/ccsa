import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  FormField,
} from "@/components/ui/form";

import { useUploadCsv } from "@/types/generated/csv";

const MAX_UPLOAD_SIZE = 1024 * 1024 * 3; // 3MB

const formSchema = z.object({
  file: z
    .instanceof(FileList)
    .refine((fileList) => fileList.length > 0, "File is required")
    .refine((fileList) => fileList[0].size <= MAX_UPLOAD_SIZE, "File size must be less than 3MB"),
});

export default function Step2() {
  const fileInputRef = useRef(null);

  const {
    // mutate,
    isLoading,
    isError,
    // data,
    error,
  } = useUploadCsv({
    mutation: {
      onSuccess: (data) => {
        console.info("Success uploading file:", data);
      },
      onError: (error) => {
        console.error("Error uploading file:", error);
      },
    },
  });

  // const { setValue } = useForm();

  const form = useForm({
    resolver: zodResolver(formSchema),
    values: {
      file: null,
    },
  });

  const onSubmit = () =>
    // values,
    // : z.infer<typeof formSchema>
    {
      // const file = values.file[0];
      // if (file) {
      //   setValue("file", values);
      //   console.log("formData", form);
      //   mutate({
      //     data: {
      //       files: new File([], file.name, { type: file.type }),
      //     },
      //   });
      // }
    };

  const handleFileChange = () =>
    // event
    {
      // const fileList = event.target.files;
      // form.setValue("file", fileList);
      // form.handleSubmit(onSubmit)();
    };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex  text-xs font-light">
        <span>Add data manually or </span>
        <fieldset>
          <FormField
            control={form.control}
            name="file"
            render={() => (
              // { field }
              <FormItem>
                <FormLabel
                  className="cursor-pointer text-xs text-primary underline"
                  // onClick={() => fileInputRef.current && fileInputRef.current.click()}
                >
                  {" "}
                  import a CSV
                </FormLabel>
                <FormControl>
                  <input
                    type="file"
                    accept=".csv"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </fieldset>
      </form>
      {isLoading && <p>Uploading...</p>}
      {isError && <p>Error uploading file: {error.message}</p>}
    </Form>
  );
}
