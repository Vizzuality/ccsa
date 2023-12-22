import { useMemo } from "react";

import { ScatterplotLayer } from "@deck.gl/layers/typed";
import { Layer } from "deck.gl/typed";
import { RasterSource } from "mapbox-gl";

import { useGetCategories } from "@/types/generated/category";

import RingExtension from "@/components/map/layers/ring-layer/extension";
import { useDeckMapboxOverlay } from "@/components/map/provider";

const GEOSJON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Tokyo",
        country: "Japan",
      },
      geometry: {
        type: "Point",
        coordinates: [139.6917, 35.6895],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Paris",
        country: "France",
      },
      geometry: {
        type: "Point",
        coordinates: [2.3522, 48.8566],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Washington, D.C.",
        country: "United States",
      },
      geometry: {
        type: "Point",
        coordinates: [-77.0369, 38.8951],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Cape Town",
        country: "South Africa",
      },
      geometry: {
        type: "Point",
        coordinates: [18.4233, -33.918861],
      },
    },
  ],
};

export interface RingLayerComponentProps {
  id: string;
  beforeId: string;
  source: RasterSource;
  opacity: number;
  visibility: boolean;
  decodeFunction: string;
  decodeParams: Record<string, unknown>;
}

export default function RingLayerComponent({ id, visibility, opacity }: RingLayerComponentProps) {
  const { data } = useGetCategories();
  console.info(data);

  const layer1: Layer = useMemo(() => {
    return new ScatterplotLayer({
      id,
      data: GEOSJON.features,
      opacity: opacity ?? 1,
      visible: visibility ?? true,
      getPosition: (d) => d.geometry.coordinates,
      getFillColor: [255, 0, 0],
      getRadius: 10,
      radiusUnits: "pixels",
    });
  }, [id, opacity, visibility]);

  const layer2: Layer = useMemo(() => {
    return new ScatterplotLayer({
      id,
      data: GEOSJON.features,
      opacity: opacity ?? 1,
      visible: visibility ?? true,
      getPosition: (d) => d.geometry.coordinates,
      getFillColor: [255, 0, 0],
      getRadius: 10,
      radiusUnits: "pixels",
      extensions: [new RingExtension()],
    });
  }, [id, opacity, visibility]);

  useDeckMapboxOverlay({
    id,
    did: "2",
    layer: layer2,
  });

  useDeckMapboxOverlay({
    id,
    did: "1",
    layer: layer1,
  });

  return null;
}
