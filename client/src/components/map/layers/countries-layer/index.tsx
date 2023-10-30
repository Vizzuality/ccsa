import { useEffect, useMemo } from "react";

import { Source, Layer, GeoJSONSourceRaw } from "react-map-gl";

import { Feature } from "geojson";

import { useGetCountries } from "@/types/generated/country";
import { LayerDataset } from "@/types/generated/strapi.schemas";
import { Config, LayerProps } from "@/types/layers";

export type CountriesLayerProps = LayerProps & {
  config: Config;
  dataset?: LayerDataset;
  beforeId?: string;
};

const CountriesLayer = ({ beforeId, dataset, config, onAdd, onRemove }: CountriesLayerProps) => {
  const { data: countriesData } = useGetCountries({
    "pagination[pageSize]": 100,
    sort: "name:asc",
  });

  const SOURCE = useMemo(() => {
    if (!countriesData?.data) return null;

    return {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: countriesData.data.map((c) => ({
          type: "Feature",
          geometry: c.attributes?.geometry as Feature["geometry"],
          properties: {
            id: c.id,
            name: c.attributes?.name,
            ...(dataset?.data?.attributes?.datum as Record<string, unknown>[])?.find(
              (d) => d.iso3 === c.attributes?.iso3,
            ),
          },
        })),
      },
    } satisfies GeoJSONSourceRaw;
  }, [countriesData, dataset?.data?.attributes?.datum]);

  const STYLES = config.styles;

  useEffect(() => {
    if (SOURCE && STYLES && onAdd) {
      onAdd({
        source: SOURCE,
        styles: STYLES,
      });
    }

    return () => {
      if (SOURCE && STYLES && onRemove) {
        onRemove({
          source: SOURCE,
          styles: STYLES,
        });
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!SOURCE || !STYLES) return null;

  return (
    <Source {...SOURCE}>
      {STYLES.map((layer) => (
        <Layer key={layer.id} {...layer} beforeId={beforeId} />
      ))}
    </Source>
  );
};

export default CountriesLayer;
