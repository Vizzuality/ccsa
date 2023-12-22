"use client";

import { Layer } from "deck.gl/typed";

import { LayerProps } from "@/types/layers";

import { useDeckMapboxOverlay } from "@/components/map/provider";

export type DeckLayerProps<T> = LayerProps &
  Partial<T> & {
    config: Layer | null;
  };

const DeckJsonLayer = <T,>({ id, config }: DeckLayerProps<T>) => {
  useDeckMapboxOverlay({
    id: `${id}`,
    layer: config,
  });

  return null;
};

export default DeckJsonLayer;
