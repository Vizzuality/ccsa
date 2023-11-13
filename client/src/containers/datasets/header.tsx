"use client";

import { useSyncLayers } from "@/app/store";

const DatasetsHeader = () => {
  const [layers] = useSyncLayers();

  return (
    <header className="flex items-center justify-between">
      <p className="text-sm">All datasets</p>

      <div className="flex translate-y-0.5 items-center space-x-1.5 text-xxs">
        <span className="font-semibold uppercase text-gray-400">Active layers:</span>
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 font-semibold">
          {layers.length}
        </span>
      </div>
    </header>
  );
};

export default DatasetsHeader;
