import { useMemo } from "react";

import { ScatterplotLayer } from "@deck.gl/layers/typed";
import { Layer } from "deck.gl/typed";
import { RasterSource } from "mapbox-gl";

import { useGetCategories } from "@/types/generated/category";

import GEOJSON from "@/components/map/layers/ring-layer/capitals.json";
import RingExtension from "@/components/map/layers/ring-layer/extension";
import { useDeckMapboxOverlay } from "@/components/map/provider";

// const GEOSJON = {
//   type: "FeatureCollection",
//   features: [
//     {
//       type: "Feature",
//       properties: {
//         name: "Tokyo",
//         country: "Japan",
//       },
//       geometry: {
//         type: "Point",
//         coordinates: [139.6917, 35.6895],
//       },
//     },
//     {
//       type: "Feature",
//       properties: {
//         name: "Paris",
//         country: "France",
//       },
//       geometry: {
//         type: "Point",
//         coordinates: [2.3522, 48.8566],
//       },
//     },
//     {
//       type: "Feature",
//       properties: {
//         name: "Washington, D.C.",
//         country: "United States",
//       },
//       geometry: {
//         type: "Point",
//         coordinates: [-77.0369, 38.8951],
//       },
//     },
//     {
//       type: "Feature",
//       properties: {
//         name: "Cape Town",
//         country: "South Africa",
//       },
//       geometry: {
//         type: "Point",
//         coordinates: [18.4233, -33.918861],
//       },
//     },
//   ],
// } satisfies FeatureCollection;

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
      data: GEOJSON.features,
      opacity: opacity ?? 1,
      visible: visibility ?? true,
      getPosition: (d) => d.geometry.coordinates,
      getFillColor: [125, 125, 125],
      getRadius: 8,
      radiusUnits: "pixels",
      pickable: true,
      onClick: (props) => {
        console.info(props);
      },
    });
  }, [id, opacity, visibility]);

  const layer2: Layer = useMemo(() => {
    return new ScatterplotLayer({
      id,
      data: GEOJSON.features,
      opacity: opacity ?? 1,
      visible: visibility ?? true,
      getPosition: (d) => d.geometry.coordinates,
      getFillColor: [125, 125, 125],
      getRandom: () => Math.random(),
      getRadius: 8,
      radiusUnits: "pixels",
      extensions: [new RingExtension()],
    });
  }, [id, opacity, visibility]);

  useDeckMapboxOverlay({
    id,
    did: "1",
    layer: layer1,
  });

  useDeckMapboxOverlay({
    id,
    did: "2",
    layer: layer2,
  });

  return null;
}
