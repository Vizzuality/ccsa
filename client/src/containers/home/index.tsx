"use client";

import { useMemo } from "react";

import { useGetDatasets } from "@/types/generated/dataset";

import { useSyncLayers } from "@/app/url-query-params";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";

const Home = () => {
  const [layers, setLayers] = useSyncLayers();

  const { data: datasetsData } = useGetDatasets({
    "pagination[pageSize]": 100,
    populate: "*",
  });

  const CATEGORIES = useMemo(() => {
    if (!datasetsData?.data?.data) return [];

    const categories = datasetsData.data.data.map((dataset) => dataset?.attributes?.category);

    const categories_map = new Map(categories.map((d) => [d?.data?.id, d]));
    return [...categories_map.values()];
  }, [datasetsData]);

  if (CATEGORIES.length === 0) return null;

  return (
    <div className="h-full overflow-auto">
      <div className="px-5 py-10">
        <h1 className="font-metropolis text-3xl text-gray-800">Explore Datasets</h1>

        {/* List of datasets */}
        <Accordion
          type="multiple"
          className="mt-5"
          defaultValue={CATEGORIES.map((c) => `${c?.data?.id}`)}
        >
          {CATEGORIES.map((category) => {
            if (!category?.data) return null;

            const DATASETS = datasetsData?.data?.data?.filter(
              (dataset) => dataset?.attributes?.category?.data?.id === category?.data?.id,
            );

            return (
              <AccordionItem key={category?.data?.id} value={`${category?.data?.id}`}>
                <AccordionTrigger className="text-xl">
                  {category?.data?.attributes?.name}
                </AccordionTrigger>

                <AccordionContent>
                  <ul className="space-y-5">
                    {DATASETS?.map((dataset) => {
                      if (!dataset?.attributes) return null;

                      const lysIds = dataset?.attributes?.layers?.data?.map((l) => l.id);

                      return (
                        <li
                          key={dataset?.id}
                          className="flex items-center justify-start space-x-2.5"
                        >
                          <Switch
                            defaultChecked={layers?.some((l) => lysIds?.includes(l))}
                            onCheckedChange={(c: boolean) => {
                              const lys = dataset?.attributes?.layers;

                              if (!lys) return;

                              setLayers((prev) => {
                                const ids = lys?.data?.map((l) => {
                                  return l.id as number;
                                });

                                if (c && ids) return [...ids, ...prev];
                                if (!c && ids) {
                                  return prev.filter((id) => !ids.includes(id));
                                }

                                return prev;
                              });
                            }}
                          />
                          <div>
                            <h2>{dataset?.attributes?.name}</h2>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
};

export default Home;
