"use client";

import { LngLatBoundsLike, useMap } from "react-map-gl";

import { useSyncBbox } from "@/app/store";

import LayerManager from "@/containers/map/layer-manager";
import Legend from "@/containers/map/legend";
import MapSettingsManagerPanel from "@/containers/map-settings";
import MapSettingsManager from "@/containers/map-settings/manager";

import Map from "@/components/map";
import Controls from "@/components/map/controls";
import SettingsControl from "@/components/map/controls/settings";
import ZoomControl from "@/components/map/controls/zoom";

export default function MapContainer({ id = "default" }: { id?: string }) {
  const { [id]: map } = useMap();
  const [bbox, setBbox] = useSyncBbox();

  const onMapViewStateChange = () => {
    if (map) {
      const b = map
        .getBounds()
        .toArray()
        .flat()
        .map((v: number) => {
          return parseFloat(v.toFixed(2));
        });
      setBbox(b);
      // setTmpBbox(undefined);
    }
  };

  return (
    <Map
      id={id}
      initialViewState={{
        bounds: bbox as LngLatBoundsLike,
      }}
      onMapViewStateChange={onMapViewStateChange}
    >
      <Controls className="absolute right-6 top-4">
        <ZoomControl />
        <SettingsControl>
          <MapSettingsManagerPanel />
        </SettingsControl>
      </Controls>

      <LayerManager />

      <Legend />

      <MapSettingsManager />
    </Map>
  );
}
