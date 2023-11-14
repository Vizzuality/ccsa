"use client";

import { useCallback, useRef, useState } from "react";

import { LngLatBoundsLike, useMap } from "react-map-gl";

import { useSyncBbox, useSyncCountry } from "@/app/store";

import LayerManager from "@/containers/map/layer-manager";
import Legend from "@/containers/map/legend";
import MapSettingsManagerPanel from "@/containers/map-settings";
import MapSettingsManager from "@/containers/map-settings/manager";

import Map from "@/components/map";
import Controls from "@/components/map/controls";
import SettingsControl from "@/components/map/controls/settings";
import ZoomControl from "@/components/map/controls/zoom";

export default function MapContainer({ id = "default" }: { id?: string }) {
  const [cursor, setCursor] = useState<string>("");
  const { [id]: map } = useMap();

  const [bbox, setBbox] = useSyncBbox();
  const [, setCountry] = useSyncCountry();
  const HOVER = useRef<mapboxgl.MapboxGeoJSONFeature | null>(null);

  const handleMapViewStateChange = () => {
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

  const handleMouseEnter = useCallback(() => {
    map!.getCanvas().style.cursor = "pointer";
    setCursor("pointer");
  }, [map]);

  const handleMouseLeave = useCallback(() => {
    setCursor("");
  }, []);

  const handleMouseMove = (e: mapboxgl.MapLayerMouseEvent) => {
    if (e.features) {
      // find the layer on hover where to add the feature state
      const CountryFeature = e.features.find(
        (f) => f.layer.source === "countries-source" || f.layer.source === "projects-source",
      );

      if (CountryFeature) {
        if (HOVER.current !== null && typeof HOVER.current.layer.source === "string") {
          map?.setFeatureState(
            {
              id: HOVER.current.id,
              source: HOVER.current.layer.source,
            },
            { hover: false },
          );
        }

        HOVER.current = CountryFeature;

        if (HOVER.current !== null && typeof HOVER.current.layer.source === "string") {
          map?.setFeatureState(
            {
              id: HOVER.current.id,
              source: HOVER.current.layer.source,
            },
            { hover: true },
          );
        }
      } else {
        if (HOVER.current !== null && typeof HOVER.current.layer.source === "string") {
          map?.setFeatureState(
            {
              id: HOVER.current.id,
              source: HOVER.current.layer.source,
            },
            { hover: false },
          );
        }
        HOVER.current = null;
      }
    }
  };

  const handleClick = (e: mapboxgl.MapLayerMouseEvent) => {
    if (e.features) {
      const COUNTRY_FEATURE = e.features.find(
        (f) => f.layer.source === "countries-source" || f.layer.source === "projects-source",
      );

      setCountry(COUNTRY_FEATURE?.properties?.iso3);
    }
  };

  return (
    <Map
      id={id}
      initialViewState={{
        bounds: bbox as LngLatBoundsLike,
      }}
      cursor={cursor}
      interactiveLayerIds={[
        "countries-layer-fill",
        "countries-layer-line",
        "projects-layer-circle",
        "projects-layer-label",
      ]}
      onMapViewStateChange={handleMapViewStateChange}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
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
