"use client";

import Markdown from "react-markdown";

import { LuInfo } from "react-icons/lu";

import { DatasetListResponseDataItem } from "@/types/generated/strapi.schemas";

import { useSyncDatasets, useSyncLayers } from "@/app/store";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";

const DatasetsItem = ({ id, attributes }: DatasetListResponseDataItem) => {
  const [datasets, setDatasets] = useSyncDatasets();
  const [, setLayers] = useSyncLayers();

  const handleToogle = () => {
    const lys = attributes?.layers;

    if (!lys) return;

    setDatasets((prev) => {
      if (id) {
        if (prev.includes(id)) {
          return prev.filter((d) => d !== id);
        }

        return [...prev, id];
      }

      return prev;
    });

    setLayers((prev) => {
      const ids = lys?.data?.map((l) => {
        return l.id as number;
      });

      if (ids) {
        if (prev.some((id) => ids.includes(id))) {
          return prev.filter((id) => !ids.includes(id));
        }

        return [...ids, ...prev];
      }

      return prev;
    });
  };

  return (
    <div
      key={id}
      role="button"
      className="group flex cursor-pointer items-center justify-between space-x-2.5 rounded-[18px] border p-2.5 hover:bg-slate-50"
      onClick={handleToogle}
    >
      <div className="flex items-center justify-start space-x-2.5">
        <Switch checked={datasets?.includes(id ?? 0)} />
        <h2>{attributes?.name}</h2>
      </div>

      <Dialog>
        <DialogTrigger onClick={(e) => e.stopPropagation()}>
          <LuInfo className="h-5 w-5" />
        </DialogTrigger>

        <DialogContent>
          <ScrollArea className="h-[80svh] p-6">
            <Markdown className="prose">{attributes?.description}</Markdown>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DatasetsItem;
