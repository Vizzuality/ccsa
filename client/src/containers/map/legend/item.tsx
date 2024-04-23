"use-client";
import { ReactElement, cloneElement, createElement, isValidElement, useMemo } from "react";

import { parseConfig } from "@/lib/json-converter";
import { getResourceParamConfig } from "@/lib/utils/layer-config";

import { useGetDatasetValues } from "@/types/generated/dataset-value";
import { useGetLayersId } from "@/types/generated/layer";
import { LayerTyped, LegendConfig, ParamsConfig } from "@/types/layers";
import { LegendType } from "@/types/legend";

import { useSyncDatasets, useSyncLayers, useSyncLayersSettings } from "@/app/store";

import LegendItem from "@/components/map/legend/item";
import {
  LegendTypeBasic,
  LegendTypeChoropleth,
  LegendTypeGradient,
} from "@/components/map/legend/item-types";
import { LegendItemProps, LegendTypeProps, SettingsManager } from "@/components/map/legend/types";
import ContentLoader from "@/components/ui/loader";

const LEGEND_TYPES: Record<LegendType, React.FC<LegendTypeProps>> = {
  basic: LegendTypeBasic,
  choropleth: LegendTypeChoropleth,
  gradient: LegendTypeGradient,
};

type MapLegendItemProps = LegendItemProps;

const getSettingsManager = (data: LayerTyped = {} as LayerTyped): SettingsManager => {
  const { params_config, metadata } = data;

  if (!params_config?.length) return {};
  const p = params_config.reduce((acc: Record<string, boolean>, { key }) => {
    if (!key) return acc;
    return {
      ...acc,
      [`${key}`]: true,
    };
  }, {});

  return {
    ...p,
    info: !!metadata,
  };
};

type ConfigType =
  | LegendConfig
  | ReactElement<{
      paramsConfig: ParamsConfig;
      onChangeSettings: (settings: Record<string, unknown>) => unknown;
    }>
  | null;

const MapLegendItem = ({ id, ...props }: MapLegendItemProps) => {
  const [, setLayers] = useSyncLayers();
  const [, setDatasets] = useSyncDatasets();
  const [layersSettings, setLayersSettings] = useSyncLayersSettings();

  const { data, isError, isFetched, isFetching, isPlaceholderData } = useGetLayersId(id, {
    populate: "metadata,dataset",
  });

  const isResourceDataset =
    data?.data?.attributes?.dataset?.data?.attributes?.value_type === "resource";

  const { data: datasetValues } = useGetDatasetValues(
    {
      filters: {
        dataset: data?.data?.attributes?.dataset?.data?.id,
      },
      populate: ["resources"],
    },
    {
      query: {
        enabled: isResourceDataset,
      },
    },
  );

  const attributes = data?.data?.attributes as LayerTyped;
  const legend_config = attributes?.legend_config;
  const params_config = attributes?.params_config;

  const config = useMemo(() => {
    const paramsConfig = getResourceParamConfig({
      dataset: data?.data?.attributes?.dataset,
      datasetValues,
      params_config,
    });

    const settings = (layersSettings && layersSettings[`${id}`]) ?? {};

    return parseConfig<ConfigType>({
      config: legend_config,
      params_config: paramsConfig,
      settings,
    });
  }, [
    data?.data?.attributes?.dataset,
    datasetValues,
    id,
    layersSettings,
    legend_config,
    params_config,
  ]);

  const settingsManager = getSettingsManager(attributes);

  const LEGEND_NAME = useMemo(() => {
    if (attributes?.dataset?.data?.attributes?.unit) {
      return `${attributes?.name} (${attributes?.dataset?.data?.attributes?.unit})`;
    }
    return attributes?.name;
  }, [attributes]);

  const LEGEND_COMPONENT = useMemo(() => {
    const l = config;
    if (!l) return null;

    if (isValidElement(l)) {
      return cloneElement(l, {
        paramsConfig: params_config,
        onChangeSettings: (settings: Record<string, unknown>) => {
          setLayersSettings((prev) => ({
            ...prev,
            [`${id}`]: {
              ...((prev ?? {})[`${id}`] ?? {}),
              ...settings,
            },
          }));
        },
      });
    }

    if (!isValidElement(l) && "items" in l) {
      const { type, ...props } = l;
      return createElement(LEGEND_TYPES[type], props);
    }

    return null;
  }, [config, params_config, setLayersSettings, id]);

  return (
    <ContentLoader
      skeletonClassName="h-10"
      data={data?.data}
      isFetching={isFetching}
      isFetched={isFetched}
      isPlaceholderData={isPlaceholderData}
      isError={isError}
    >
      <LegendItem
        id={id}
        name={LEGEND_NAME}
        settingsManager={settingsManager}
        {...props}
        onRemove={() => {
          setDatasets((prev) => {
            const current = [...prev];
            const index = current.indexOf(attributes?.dataset?.data?.id as number);
            if (index > -1) {
              current.splice(index, 1);
            }
            return current;
          });
          setLayers((prev) => {
            const current = [...prev];
            const index = current.indexOf(id);
            if (index > -1) {
              current.splice(index, 1);
            }
            return current;
          });
        }}
        // InfoContent={!!metadata && <Metadata {...attributes} />}
      >
        {LEGEND_COMPONENT}
      </LegendItem>
    </ContentLoader>
  );
};

export default MapLegendItem;
