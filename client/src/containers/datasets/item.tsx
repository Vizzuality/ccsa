"use client";

import Markdown from "react-markdown";

import { LuInfo } from "react-icons/lu";

import { DatasetListResponseDataItem } from "@/types/generated/strapi.schemas";

import { useSyncLayers } from "@/app/url-query-params";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";

const DatasetsItem = ({ id, attributes }: DatasetListResponseDataItem) => {
  const lysIds = attributes?.layers?.data?.map((l) => l.id as number);
  const [layers, setLayers] = useSyncLayers();

  const handleToogle = () => {
    const lys = attributes?.layers;

    if (!lys) return;

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
      className="group flex items-center justify-between space-x-2.5 rounded-[18px] border p-2.5 hover:bg-slate-50"
    >
      <div className="flex items-center justify-start space-x-2.5">
        <Switch checked={layers?.some((l) => lysIds?.includes(l))} onCheckedChange={handleToogle} />
        <button onClick={handleToogle}>
          <h2>{attributes?.name}</h2>
        </button>
      </div>

      <Dialog>
        <DialogTrigger>
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
