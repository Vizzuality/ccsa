"use client";

import { useMemo, useState } from "react";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { LuFilter } from "react-icons/lu";
import * as z from "zod";

import { useGetCountries } from "@/types/generated/country";
import { useGetPillars } from "@/types/generated/pillar";

import {
  useSyncAvailableForFunding,
  useSyncCountries,
  useSyncPillars,
  useSyncProjectStatus,
} from "@/app/store";

import { GET_COUNTRIES_OPTIONS } from "@/constants/countries";
import { GET_PILLARS_OPTIONS } from "@/constants/pillars";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MultiCombobox } from "@/components/ui/multicombobox";
import { useGetProjectStatuses } from "@/types/generated/project-status";

const FormSchema = z.object({
  pillars: z.array(z.number()),
  countries: z.array(z.string()).optional(),
  status: z.array(z.number()).optional(),
  available_for_funding: z.boolean().optional(),
});

const ProjectsFiltersDialog = () => {
  const [open, setOpen] = useState(false);

  const [pillars, setPillars] = useSyncPillars();
  const [availableForFunding, setAvailableForFunding] = useSyncAvailableForFunding();
  const [countries, setCountries] = useSyncCountries();
  const [status, setProjectStatus] = useSyncProjectStatus();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pillars,
      countries: [],
      status: [],
      available_for_funding: undefined,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setPillars(data.pillars);

    setCountries(data.countries ?? null);

    setAvailableForFunding(!!data.available_for_funding);

    setProjectStatus(data.status ?? null);

    setOpen(false);
  }
  const { data: pillarsData } = useGetPillars(GET_PILLARS_OPTIONS);
  const { data: countriesData } = useGetCountries(GET_COUNTRIES_OPTIONS);
  const { data: statusData } = useGetProjectStatuses();

  const OPTIONS = useMemo(() => {
    if (!countriesData?.data) return [];

    return countriesData.data.map((c) => {
      return {
        value: c.attributes?.iso3 ?? "",
        label: c.attributes?.name ?? "",
      };
    });
  }, [countriesData]);

  const OPTIONS_STATUS = useMemo(() => {
    if (!statusData?.data) return [];

    return statusData.data.map((c) => {
      return {
        value: c.attributes?.maturity ?? 0,
        label: c.attributes?.name ?? "",
      };
    });
  }, [statusData]);

  useMemo(() => {
    form.setValue("pillars", pillars);
    form.setValue("countries", countries ?? undefined);
    form.setValue("available_for_funding", availableForFunding ?? undefined);
    form.setValue("status", status ?? undefined);
  }, [form, pillars, countries, availableForFunding, status]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="space-x-1">
          <span>Filter</span>
          <LuFilter className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle className="sr-only">Filters</DialogTitle>
        <div className="space-y-5 p-5">
          <h2 className="font-metropolis text-3xl tracking-tight">Filters</h2>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* PILLARS */}
              <FormField
                control={form.control}
                name="pillars"
                render={() => (
                  <FormItem>
                    <div className="mb-3">
                      <FormLabel className="text-base">Pillars</FormLabel>
                    </div>

                    {pillarsData?.data?.map((item) => {
                      if (!!item.id) {
                        const pillarId = item.id;

                        return (
                          <FormField
                            key={pillarId}
                            control={form.control}
                            name="pillars"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={pillarId}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      className="cursor-pointer"
                                      checked={field.value?.includes(pillarId)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, pillarId])
                                          : field.onChange(
                                              field.value?.filter((value) => value !== pillarId),
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="cursor-pointer text-sm font-normal">
                                    {item.attributes?.name}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        );
                      }
                    })}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* AVAILABLE FOR FUNDING */}
              <FormField
                control={form.control}
                name="available_for_funding"
                render={({ field }) => (
                  <FormItem>
                    <div className="mb-3">
                      <FormLabel className="text-base">Available for funding</FormLabel>
                    </div>

                    <div className="flex items-center space-x-3">
                      <FormControl>
                        <Checkbox
                          className="cursor-pointer"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="cursor-pointer text-sm font-normal">
                        Only show projects available for funding
                      </FormLabel>
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* PROJECT STATUS */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Project Status</FormLabel>

                    <MultiCombobox
                      values={field.value}
                      options={OPTIONS_STATUS}
                      placeholder="Select project status"
                      onChange={field.onChange}
                    />

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* COUNTRY */}
              <FormField
                control={form.control}
                name="countries"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Country</FormLabel>

                    <MultiCombobox
                      values={field.value}
                      options={OPTIONS}
                      placeholder="Select a country..."
                      onChange={field.onChange}
                    />

                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex space-x-2.5">
                <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                  Cancel
                </Button>

                <Button type="submit">Save</Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectsFiltersDialog;
