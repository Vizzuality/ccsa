"use client";

import { useMemo } from "react";

import { Layer } from "react-map-gl";

import { useSyncLayers, useSyncLayersSettings } from "@/app/url-query-params";

import LayerManagerItem from "@/containers/map/layer-manager/item";

import { DeckMapboxOverlayProvider } from "@/components/map/provider";

const LayerManager = () => {
  const [layers] = useSyncLayers();
  const [layersSettings, setLayersSettings] = useSyncLayersSettings();

  // Sync layers settings with layers
  useMemo(() => {
    if (!layers?.length && !layersSettings) return;

    if (!layers?.length && layersSettings) {
      setLayersSettings(null);
      return;
    }

    const lSettingsKeys = Object.keys(layersSettings || {});

    lSettingsKeys.forEach((key) => {
      if (layers.includes(Number(key))) return;

      setLayersSettings((prev) => {
        const current = { ...prev };
        delete current[key];
        return current;
      });
    });
  }, [layers, layersSettings, setLayersSettings]);

  return (
    <DeckMapboxOverlayProvider>
      <>
        {/*
          Generate all transparent backgrounds to be able to sort by layers without an error
          - https://github.com/visgl/react-map-gl/issues/939#issuecomment-625290200
        */}
        {layers.map((l, i) => {
          const beforeId = i === 0 ? "custom-layers" : `${layers[i - 1]}-layer`;
          return (
            <Layer
              id={`${l}-layer`}
              key={l}
              type="background"
              layout={{ visibility: "none" }}
              beforeId={beforeId}
            />
          );
        })}

        {/*
          Loop through active layers. The id is gonna be used to fetch the current layer and know how to order the layers.
          The first item will always be at the top of the layers stack
        */}
        {layers.map((l, i) => {
          const beforeId = i === 0 ? "custom-layers" : `${layers[i - 1]}-layer`;
          return (
            <LayerManagerItem
              key={l}
              id={l}
              beforeId={beforeId}
              settings={(layersSettings && layersSettings[l]) ?? { opacity: 1, visibility: true }}
            />
          );
        })}
      </>
    </DeckMapboxOverlayProvider>
  );
};

export default LayerManager;
