import { useEffect, useMemo } from "react";

import { Source, Layer, GeoJSONSourceRaw } from "react-map-gl";

import { Feature } from "geojson";

import { isDatasetValueProperty } from "@/lib/datasets";

import { useGetCountries } from "@/types/generated/country";
import { useGetDatasetValues } from "@/types/generated/dataset-value";
import { LayerDataset } from "@/types/generated/strapi.schemas";
import { Config, LayerProps, ParamsConfigValue } from "@/types/layers";

import { useSyncLayersSettings } from "@/app/store";

export type CountriesLayerProps = LayerProps & {
  config: Config;
  dataset?: LayerDataset;
  beforeId?: string;
  paramsConfig?: unknown;
};

const CountriesLayer = ({
  id,
  beforeId,
  dataset,
  config,
  paramsConfig,
  onAdd,
  onRemove,
}: CountriesLayerProps) => {
  const [, setLayersSettings] = useSyncLayersSettings();

  const { data: countriesData } = useGetCountries({
    "pagination[pageSize]": 100,
    sort: "name:asc",
  });

  const { data: datasetValues } = useGetDatasetValues({
    filters: {
      dataset: dataset?.data?.id,
    },
    populate: ["country", "resources"],
  });

  useEffect(() => {
    const datasetValueT = dataset?.data?.attributes?.value_type;
    const isResource = datasetValueT === "resource";
    const useParamsConfig =
      Array.isArray(paramsConfig) &&
      paramsConfig?.some((c: ParamsConfigValue) => c.key === "minValue" || c.key === "maxValue");
    if (isResource && id && useParamsConfig) {
      const layerId = id.replace("-layer", "");

      const maxMin = datasetValues?.data?.reduce(
        (acc, curr) => {
          const resources = curr.attributes?.resources?.data?.length || 0;
          return {
            maxValue: Math.max(acc.maxValue, resources),
            minValue: Math.min(acc.minValue, resources),
          };
        },
        { maxValue: 0, minValue: Infinity },
      );

      setLayersSettings((prev) => ({
        ...prev,
        [layerId]: {
          ...prev?.[layerId],
          minValue: maxMin?.minValue,
          maxValue: maxMin?.maxValue,
        },
      }));
    }
  }, [dataset?.data?.attributes?.value_type, datasetValues, id, paramsConfig, setLayersSettings]);

  const SOURCE = useMemo(() => {
    if (!countriesData?.data || !datasetValues?.data) return null;
    const datasetValueT = dataset?.data?.attributes?.value_type;
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
  }, [countriesData?.data, dataset?.data?.attributes?.value_type, id, datasetValues?.data]);

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
