"use client";

import { ReactElement, cloneElement, useCallback } from "react";

import { Layer } from "deck.gl/typed";
import { useAtomValue, useSetAtom } from "jotai";

import { parseConfig } from "@/lib/json-converter";

import { useGetLayersId } from "@/types/generated/layer";
import { LayerResponseDataObject } from "@/types/generated/strapi.schemas";
import { Config, LayerTyped } from "@/types/layers";

import { layersInteractiveAtom, layersInteractiveIdsAtom } from "@/app/store";

import CountriesLayer from "@/components/map/layers/countries-layer";
import DeckLayer from "@/components/map/layers/deck-layer";
import MapboxLayer from "@/components/map/layers/mapbox-layer";

interface LayerManagerItemProps extends Required<Pick<LayerResponseDataObject, "id">> {
  beforeId: string;
  settings: Record<string, unknown>;
}

const LayerManagerItem = ({ id, beforeId, settings }: LayerManagerItemProps) => {
  const { data } = useGetLayersId(id, {
    populate: "dataset,metadata",
  });

  const layersInteractive = useAtomValue(layersInteractiveAtom);
  const setLayersInteractive = useSetAtom(layersInteractiveAtom);
  const setLayersInteractiveIds = useSetAtom(layersInteractiveIdsAtom);

  const handleAddMapboxLayer = useCallback(
    ({ styles }: Config) => {
      if (!data?.data?.attributes) return null;

      const { interaction_config } = data.data.attributes as LayerTyped;

      if (interaction_config?.enabled && styles) {
        const ids = styles.map((l) => l.id);

        if (layersInteractive.includes(id)) {
          return;
        }

        setLayersInteractive((prev) => [...prev, id]);
        setLayersInteractiveIds((prev) => [...prev, ...ids]);
      }
    },
    [data?.data?.attributes, id, layersInteractive, setLayersInteractive, setLayersInteractiveIds],
  );

  const handleRemoveMapboxLayer = useCallback(
    ({ styles }: Config) => {
      if (!data?.data?.attributes) return null;

      const { interaction_config } = data.data.attributes as LayerTyped;

      if (interaction_config?.enabled && styles) {
        const ids = styles.map((l) => l.id);

        setLayersInteractive((prev) => prev.filter((i) => i !== id));
        setLayersInteractiveIds((prev) => prev.filter((i) => !ids.includes(`${i}`)));
      }
    },
    [data?.data?.attributes, id, setLayersInteractive, setLayersInteractiveIds],
  );

  if (!data?.data?.attributes) return null;

  const { type } = data.data.attributes as LayerTyped;

  if (type === "mapbox") {
    const { config, params_config } = data.data.attributes;

    const c = parseConfig<Config>({
      config,
      params_config,
      settings,
    });

    if (!c) return null;

    return (
      <MapboxLayer
        id={`${id}-layer`}
        beforeId={beforeId}
        config={c}
        onAdd={handleAddMapboxLayer}
        onRemove={handleRemoveMapboxLayer}
      />
    );
  }

  if (type === "countries") {
    return (
      <CountriesLayer
        layer={data.data.attributes}
        id={`${id}-layer`}
        beforeId={beforeId}
        onAdd={handleAddMapboxLayer}
        onRemove={handleRemoveMapboxLayer}
        settings={settings}
      />
    );
  }

  if (type === "deckgl") {
    const { config, params_config } = data.data.attributes;
    const c = parseConfig<Layer>({
      config,
      params_config,
      settings,
    });

    return <DeckLayer id={`${id}-layer`} beforeId={beforeId} config={c} />;
  }

  if (type === "component") {
    const { config, params_config } = data.data.attributes;
    const c = parseConfig<ReactElement>({
      config,
      params_config,
      settings,
    });

    if (!c) return null;
    return cloneElement(c, { id: `${id}-layer`, beforeId });
  }
};

export default LayerManagerItem;
