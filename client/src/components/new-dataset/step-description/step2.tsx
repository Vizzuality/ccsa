import React, { useRef, useState } from "react";
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

import { useValidateCsv } from "@/hooks";
import { useSession } from "next-auth/react";

const MAX_UPLOAD_SIZE = 1024 * 1024 * 3; // 3MB

const formSchema = z.object({
  file: z
    .instanceof(FileList)
    .refine((fileList) => fileList.length > 0, "File is required")
    .refine((fileList) => fileList[0].size <= MAX_UPLOAD_SIZE, "File size must be less than 3MB"),
});

export default function Step2() {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  // const {
  //   // mutate,
  //   isLoading,
  //   isError,
  //   // data,
  //   error,
  // } = useUploadCsv({
  //   mutation: {
  //     onSuccess: (data) => {
  //       console.info("Success uploading file:", data);
  //     },
  //     onError: (error) => {
  //       console.error("Error uploading file:", error);
  //     },
  //   },
  // });

  // const { setValue } = useForm();
  const { setValue } = useForm();

  const { data: session } = useSession();
  const { apiToken } = session;

  const form = useForm({
    resolver: zodResolver(formSchema),
    values: {
      file: null,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const file = values.file[0];
    if (file) {
      setValue("file", values);
    }
  }

  const { isLoading, data, isError } = useValidateCsv(
    file,
    {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
    },
    {
      enable: !!file,
    },
  );

  const handleFileChange = (event) => {
    const fileList = event.target.files;
    setFile(fileList[0]);
    form.setValue("file", fileList);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex space-x-2 text-xs font-light">
        <span>Add data manually or </span>
        <fieldset>
          <FormField
            control={form.control}
            name="file"
            render={() => (
              // { field }
              <FormItem>
                <FormLabel className="cursor-pointer text-xs text-primary underline">
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
