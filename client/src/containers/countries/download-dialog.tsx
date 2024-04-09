"use client";

import { useMemo } from "react";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { mkConfig, generateCsv, download } from "export-to-csv";
import * as z from "zod";

import {
  getDownloadEmails,
  usePostDownloadEmails,
  usePutDownloadEmailsId,
} from "@/types/generated/download-email";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useTableData from "./utils";

const CSV_CONFIG = mkConfig({
  filename: `CCSA-data-`,
  useKeysAsHeaders: true,
});

const FormSchema = z.object({
  email: z.string().email(),
});

const CountryDownloadDialog = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });

  const mutationPostDownloadEmails = usePostDownloadEmails();
  const mutationPutDownloadEmails = usePutDownloadEmailsId();

  const { TABLE_ROWS_DATA } = useTableData();

  const csvData = useMemo(() => {
    const data =
      TABLE_ROWS_DATA?.map((d) =>
        d.values.reduce(
          (acc, curr) => {
            const value = curr.isResource
              ? curr.resources?.map((r) => r.link_title).join(", ")
              : curr.value;
            return {
              ...acc,
              ...(curr.countryName ? { [curr.countryName]: value } : {}),
            };
          },
          { dataset: d.name, "dataset unit": d.unit },
        ),
      ) ?? [];
    const CSV = generateCsv(CSV_CONFIG)(data);

    return CSV;
  }, []);

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    // check if email exists
    return getDownloadEmails({
      filters: {
        email: data.email,
      },
    })
      .then((d) => {
        if (d.data?.length) {
          // update
          return mutationPutDownloadEmails.mutate({
            id: d.data[0].id as number,
            data: {
              data: {
                email: data.email,
                downloads: (d.data[0].attributes?.downloads as number) + 1,
              },
            },
          });
        } else {
          // create
          return mutationPostDownloadEmails.mutate({
            data: {
              data: {
                email: data.email,
                downloads: 1,
              },
            },
          });
        }
      })
      .catch((e) => {
        form.setError("root", {
          type: e?.response?.data?.error?.status,
          message: e?.response?.data?.error?.message,
        });
      });
  };

  return (
    <div className="max-h-[90svh] overflow-auto p-10">
      <section className="space-y-2.5">
        <div className="w-[300px]">
          {!form.formState.isSubmitSuccessful && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                {/* EMAIL */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <div className="mb-3 space-y-2.5">
                        <FormLabel className="text-base">Download data</FormLabel>
                        <FormDescription>
                          Please, enter your email to download the data. We will not share your
                          email with anyone.
                        </FormDescription>
                      </div>

                      <FormControl>
                        <Input type="email" placeholder="Type your email..." {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2.5">
                  <Button type="submit">Submit</Button>
                  {form.formState.errors.root?.message && (
                    <FormMessage>
                      {form.formState.errors.root?.message || form.formState.errors.root?.type}
                    </FormMessage>
                  )}
                </div>
              </form>
            </Form>
          )}

          {form.formState.isSubmitSuccessful && (
            <div className="space-y-5">
              <div className="mb-3 space-y-2.5">
                <div className="text-base font-medium">Download data</div>
                <div className="text-sm text-muted-foreground">
                  Thank you for your interest. Please, click the button below to download the data.
                </div>
              </div>

              <div className="flex space-x-2.5">
                <Button
                  onClick={() => {
                    if (!csvData) return;
                    download({
                      ...CSV_CONFIG,
                      filename: `${CSV_CONFIG.filename}${new Date().toISOString()}.csv`,
                    })(csvData);
                  }}
                >
                  Download
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CountryDownloadDialog;
