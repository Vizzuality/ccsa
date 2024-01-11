import { useMemo } from "react";

import { ScatterplotLayer } from "@deck.gl/layers/typed";
import { Layer } from "deck.gl/typed";

import GEOJSON from "@/components/map/layers/ring-layer/capitals.json";
import TestExtension from "@/components/map/layers/test-layer/extension";
import { useDeckMapboxOverlay } from "@/components/map/provider";

export interface TestLayerComponentProps {
  id: string;
  beforeId: string;
  opacity: number;
  visibility: boolean;
}

export default function TestLayerComponent({ id, visibility, opacity }: TestLayerComponentProps) {
  const uStartTime = useMemo(() => performance.now() / 1000, []);

  const layer1: Layer = useMemo(() => {
    return new ScatterplotLayer({
      id,
      data: GEOJSON.features,
      opacity: opacity ?? 1,
      visible: visibility ?? true,
      getPosition: (d) => d.geometry.coordinates,
      getFillColor: (d) => [
        (1 - Math.abs(d.geometry.coordinates[1] / 90)) * 255,
        (1 - Math.abs(d.geometry.coordinates[0] / 180)) * 255,
        0,
      ],
      getRadius: 2,
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
      uStartTime,
      extensions: [new TestExtension()],
    });
  }, [id, opacity, visibility, uStartTime]);

  useDeckMapboxOverlay({
    id,
    did: "test-2",
    layer: layer2,
  });

  useDeckMapboxOverlay({
    id,
    did: "test-1",
    layer: layer1,
  });

  return null;
}
