import { useEffect, useMemo } from "react";

import { Source, Layer, GeoJSONSourceRaw } from "react-map-gl";

import { Feature } from "geojson";

import { isDatasetValueProperty } from "@/lib/datasets";
import { parseConfig } from "@/lib/json-converter";
import { getResourceParamConfig } from "@/lib/utils/layer-config";

import { useGetCountries } from "@/types/generated/country";
import { useGetDatasetValues } from "@/types/generated/dataset-value";
import { Layer as LayerConfig } from "@/types/generated/strapi.schemas";
import { Config, LayerProps } from "@/types/layers";

export type CountriesLayerProps = LayerProps & {
  beforeId?: string;
  layer?: LayerConfig;
  settings: Record<string, unknown>;
};

const CountriesLayer = ({
  id,
  beforeId,
  layer,
  settings,
  onAdd,
  onRemove,
}: CountriesLayerProps) => {
  const { data: countriesData } = useGetCountries({
    "pagination[pageSize]": 100,
    sort: "name:asc",
  });

  const { data: datasetValues } = useGetDatasetValues({
    filters: {
      dataset: layer?.dataset?.data?.id,
    },
    populate: {
      country: {
        fields: ["name", "iso3"],
      },
      resources: true,
    },
  });

  const config = useMemo(() => {
    const paramsConfig = getResourceParamConfig({
      dataset: layer?.dataset,
      datasetValues,
      params_config: layer?.params_config as Record<string, unknown>[] | undefined,
    });

    return parseConfig<Config>({
      config: layer?.config,
      params_config: paramsConfig,
      settings,
    });
  }, [datasetValues, layer?.config, layer?.dataset, layer?.params_config, settings]);

  const SOURCE = useMemo(() => {
    if (!countriesData?.data || !datasetValues?.data) return null;
    const datasetValueT = layer?.dataset?.data?.attributes?.value_type;
    const isResource = datasetValueT === "resource";
    const valueName = `value_${datasetValueT}`;

    return {
      // @ts-expect-error GeoJSONSourceRaw doesn't have id but it works
      id: `${id}-source`,
      type: "geojson",
      promoteId: "id",
      data: {
        type: "FeatureCollection",
        features: countriesData.data.map((c) => {
          const datasetValue = datasetValues?.data?.find(
            (v) => v.attributes?.country?.data?.id === c.id,
          );
          const resourceValue = datasetValue?.attributes?.resources?.data?.length || 0;
          const v =
            !isResource &&
            !!isDatasetValueProperty(valueName) &&
            datasetValue?.attributes?.[valueName];
          // Convert boolean to yes/no
          const value = !isResource && valueName === "value_boolean" ? (v ? "yes" : "no") : v;

          return {
            type: "Feature",
            id: c.id,
            geometry: c.attributes?.geometry as Feature["geometry"],
            properties: {
              id: c.id,
              name: c.attributes?.name,
              iso3: c.attributes?.iso3,
              value: isResource ? resourceValue : value,
            },
          };
        }),
      },
    } satisfies GeoJSONSourceRaw;
  }, [countriesData?.data, datasetValues?.data, layer?.dataset?.data?.attributes?.value_type, id]);

  const STYLES = config?.styles;

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
