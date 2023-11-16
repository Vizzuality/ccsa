"use client";

import { useState } from "react";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { LuFilter } from "react-icons/lu";
import * as z from "zod";

import { useGetPillars } from "@/types/generated/pillar";

import { useSyncPillars } from "@/app/store";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const FormSchema = z.object({
  pillars: z.array(z.number()),
});

const ProjectsFiltersDialog = () => {
  const [open, setOpen] = useState(false);
  const [pillars, setPillars] = useSyncPillars();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pillars,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setPillars(data.pillars);

    setOpen(false);
  }
  const { data: pillarsData } = useGetPillars();

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
                      <FormDescription>
                        Select the Pillars you want to display in the sidebar.
                      </FormDescription>
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
