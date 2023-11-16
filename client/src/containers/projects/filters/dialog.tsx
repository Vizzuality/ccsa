"use client";

import { useMemo, useState } from "react";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { LuFilter } from "react-icons/lu";
import * as z from "zod";

import { useGetCountries } from "@/types/generated/country";
import { useGetPillars } from "@/types/generated/pillar";

import { useSyncCountry, useSyncPillars } from "@/app/store";

import { GET_COUNTRIES_OPTIONS } from "@/constants/countries";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FormSchema = z.object({
  pillars: z.array(z.number()),
  country: z.string().optional(),
});

const ProjectsFiltersDialog = () => {
  const [open, setOpen] = useState(false);
  const [country, setCountry] = useSyncCountry();
  const [pillars, setPillars] = useSyncPillars();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pillars,
      country,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setPillars(data.pillars);

    if (data.country === "all") setCountry(null);
    else setCountry(data.country ?? null);

    setOpen(false);
  }
  const { data: pillarsData } = useGetPillars();
  const { data: countriesData } = useGetCountries(GET_COUNTRIES_OPTIONS);

  useMemo(() => {
    form.setValue("pillars", pillars);
    form.setValue("country", country);
  }, [form, pillars, country]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <LuFilter className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent>
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
                    <div className="mb-4">
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

              {/* COUNTRY */}
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {/* @ts-expect-error I know what I'm doing */}
                        <SelectItem value={null}>All</SelectItem>

                        {countriesData?.data?.map((item) => {
                          if (!!item.attributes?.iso3) {
                            const countryIso = item.attributes?.iso3;

                            return (
                              <SelectItem key={countryIso} value={countryIso}>
                                {item.attributes?.name}
                              </SelectItem>
                            );
                          }
                        })}
                      </SelectContent>
                    </Select>

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
