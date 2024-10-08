"use client";

import { useMemo } from "react";

import { Layer } from "react-map-gl";

import { usePathname } from "next/navigation";

import {
  useSyncCountries,
  useSyncCountry,
  useSyncLayers,
  useSyncLayersSettings,
} from "@/app/store";

import LayerManagerItem from "@/containers/map/layer-manager/item";

import CountriesLayer from "@/components/map/layers/countries-layer";
import ProjectsLayer from "@/components/map/layers/projects-layer";
import { DeckMapboxOverlayProvider } from "@/components/map/provider";

const LayerManager = () => {
  const pathname = usePathname();
  const [layers] = useSyncLayers();
  const [layersSettings, setLayersSettings] = useSyncLayersSettings();
  const [country] = useSyncCountry();
  const [countries] = useSyncCountries();

  // Sync layers settings with layers
  useMemo(() => {
    if (!layers?.length && !layersSettings) return;

    if (!layers?.length && layersSettings) {
      setTimeout(() => {
        setLayersSettings(null);
      }, 0);

      return;
    }

    const lSettingsKeys = Object.keys(layersSettings || {});

    lSettingsKeys.forEach((key) => {
      if (layers.includes(Number(key))) return;

      setTimeout(() => {
        setLayersSettings((prev) => {
          const current = { ...prev };
          delete current[key];
          return current;
        });
      }, 0);
    });
  }, [layers, layersSettings, setLayersSettings]);

  return (
    <DeckMapboxOverlayProvider>
      <>
        <CountriesLayer
          id="countries"
          beforeId="priority-layers"
          layer={{
            dataset: { data: { id: 0 } },
            legend_config: {},
            params_config: [],
            interaction_config: {},
            type: "countries",
            config: {
              styles: [
                {
                  id: "countries-layer-line",
                  type: "line",
                  paint: {
                    "line-color": [
                      "case",
                      ...(pathname === "/" ? [["==", ["get", "iso3"], country], "#333"] : []),
                      ...(pathname === "/projects" && countries?.length
                        ? countries.map((c) => [["==", ["get", "iso3"], c], "#333"]).flat()
                        : [true, "#777"]),
                      "#777",
                    ],
                    "line-opacity": 1,
                    "line-width": [
                      "case",
                      ["boolean", ["feature-state", "hover"], false],
                      2,
                      ...(pathname === "/" ? [["==", ["get", "iso3"], country], 2] : []),
                      ...(pathname === "/projects" && countries?.length
                        ? countries.map((c) => [["==", ["get", "iso3"], c], 2]).flat()
                        : []),

                      1.5,
                    ],
                  },
                },
                {
                  id: "countries-layer-fill",
                  type: "fill",
                  paint: {
                    "fill-color": "#000",
                    "fill-opacity": 0,
                  },
                },
              ],
            },
          }}
          settings={{ opacity: 1, visibility: true }}
        />

        {pathname === "/projects" && (
          <ProjectsLayer
            id="projects"
            config={{
              styles: [
                {
                  id: "projects-layer-circle",
                  type: "circle",
                  paint: {
                    "circle-color": [
                      "case",
                      ["boolean", ["feature-state", "hover"], false],
                      "#5dc22c",
                      "#78D64B",
                    ],
                    "circle-radius": [
                      "interpolate",
                      ["linear"],
                      ["get", "projects"],
                      0,
                      10,
                      100,
                      20,
                    ],
                    "circle-stroke-color": "#fff",
                    "circle-stroke-width": 2,
                    "circle-stroke-opacity": ["interpolate", ["linear"], ["zoom"], 2, 0, 3, 1],
                    "circle-opacity": ["interpolate", ["linear"], ["zoom"], 2, 0, 3, 1],
                  },
                },
                {
                  id: "projects-layer-label",
                  type: "symbol",
                  paint: {
                    "text-opacity": ["interpolate", ["linear"], ["zoom"], 2, 0, 3, 1],
                  },
                  layout: {
                    "text-field": ["get", "projects"],
                    "text-size": 12,
                    "text-allow-overlap": true,
                    "text-ignore-placement": true,
                  },
                },
                {
                  id: "projects-heat",
                  type: "heatmap",
                  maxzoom: 9,
                  paint: {
                    // Increase the heatmap weight based on frequency and property magnitude
                    "heatmap-weight": ["interpolate", ["linear"], ["get", "projects"], 0, 0, 5, 1],
                    // Increase the heatmap color weight weight by zoom level
                    // heatmap-intensity is a multiplier on top of heatmap-weight
                    "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 0, 1, 9, 3],
                    // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
                    // Begin color ramp at 0-stop with a 0-transparancy color
                    // to create a blur-like effect.
                    "heatmap-color": [
                      "interpolate",
                      ["linear"],
                      ["heatmap-density"],
                      0,
                      "rgba(255,255,0,0)",
                      0.2,
                      "rgb(240,235,255)",
                      0.4,
                      "rgb(209,229,255)",
                      0.6,
                      "rgb(219,253,199)",
                      0.8,
                      "rgb(138,239,98)",
                      1,
                      "rgb(24,178,43)",
                    ],
                    // Adjust the heatmap radius by zoom level
                    "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 0, 20, 4, 40],
                    // Transition from heatmap to circle layer by zoom level
                    "heatmap-opacity": ["interpolate", ["linear"], ["zoom"], 2, 1, 3, 0],
                  },
                },
              ],
            }}
          />
        )}

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
