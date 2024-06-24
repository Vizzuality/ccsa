"use client";

import Markdown from "react-markdown";

import Link from "next/link";

import { useAtomValue } from "jotai";
import { useSession } from "next-auth/react";
import { LuInfo } from "react-icons/lu";

import { DatasetListResponseDataItem } from "@/types/generated/strapi.schemas";

import { datasetSearchAtom, useSyncDatasets, useSyncLayers } from "@/app/store";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import SearchHighlight from "@/components/ui/search-highlight";
import { Switch } from "@/components/ui/switch";

const DatasetsItem = ({ id, attributes }: DatasetListResponseDataItem) => {
  const [datasets, setDatasets] = useSyncDatasets();
  const [, setLayers] = useSyncLayers();
  const datasetSearch = useAtomValue(datasetSearchAtom);

  const { data: user } = useSession();

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
        <h2>
          <SearchHighlight query={datasetSearch}>{attributes?.name}</SearchHighlight>
        </h2>
      </div>
      <div className="flex items-center space-x-2.5">
        {user && (
          <Link
            href="/datasets/edit"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md border border-primary bg-transparent px-2.5 py-1 text-[10px] text-sm font-medium text-primary ring-offset-background transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 "
          >
            Edit
          </Link>
        )}

        <Dialog>
          <DialogTrigger onClick={(e) => e.stopPropagation()}>
            <LuInfo className="h-5 w-5" />
          </DialogTrigger>

          <DialogContent>
            <ScrollArea className="max-h-[80svh] p-6">
              <Markdown className="prose">{attributes?.description}</Markdown>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default DatasetsItem;
