"use client";

import { useMemo } from "react";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { mkConfig, generateCsv, download } from "export-to-csv";
import * as z from "zod";

import { useGetCountries } from "@/types/generated/country";
import { useGetDatasets } from "@/types/generated/dataset";
import {
  getDownloadEmails,
  usePostDownloadEmails,
  usePutDownloadEmailsId,
} from "@/types/generated/download-email";

import { useSyncCountriesComparison, useSyncCountry, useSyncDatasets } from "@/app/store";

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

const CSV_CONFIG = mkConfig({
  filename: `CCSA-data-`,
  useKeysAsHeaders: true,
});

const FormSchema = z.object({
  email: z.string().email(),
});

const CountryDownloadDialog = () => {
  const [country] = useSyncCountry();
  const [countriesComparison] = useSyncCountriesComparison();
  const [datasets] = useSyncDatasets();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });

  const { data: countriesData } = useGetCountries({
    "pagination[pageSize]": 100,
    sort: "name:asc",
  });

  const { data: datasetsData } = useGetDatasets(
    {
      filters: {
        id: datasets,
      },
    },
    {
      query: {
        enabled: !!datasets && !!datasets.length,
        keepPreviousData: !!datasets && !!datasets.length,
      },
    },
  );

  const mutationPostDownloadEmails = usePostDownloadEmails();
  const mutationPutDownloadEmails = usePutDownloadEmailsId();

  const CSV_DATA = useMemo(() => {
    const data =
      datasetsData?.data
        ?.sort((a, b) => {
          if (!a.id || !b.id) return 0;
          return datasets.indexOf(b.id) - datasets.indexOf(a.id);
        })
        ?.map((d) => {
          const { id, attributes } = d;
          const values = (attributes?.datum as Record<string, string | number>[]).filter((d1) =>
            [country, ...countriesComparison].includes(`${d1.iso3}`),
          );

          return {
            id,
            unit: attributes?.unit ?? "",
            name: attributes?.name ?? "",
            ...values.reduce((acc, v) => {
              const C = countriesData?.data?.find((c1) => c1.attributes?.iso3 === v.iso3);
              return {
                ...acc,
                [C?.attributes?.name ?? ""]: v.value ?? "",
              };
            }, {}),
          };
        }) ?? [];

    if (!data.length) return null;

    const CSV = generateCsv(CSV_CONFIG)(data);

    return CSV;
  }, [country, datasets, countriesComparison, datasetsData?.data, countriesData?.data]);

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
                    if (!CSV_DATA) return;
                    download({
                      ...CSV_CONFIG,
                      filename: `${CSV_CONFIG.filename}${new Date().toISOString()}.csv`,
                    })(CSV_DATA);
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
