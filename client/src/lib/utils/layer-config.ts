import { LayerDataset } from "@/types/generated/strapi.schemas";
import { DatasetValueListResponse } from "@/types/generated/strapi.schemas";

type UseConfig = {
  params_config?: Record<string, unknown>[];
  dataset?: LayerDataset;
  datasetValues?: DatasetValueListResponse;
};

export const getResourceParamConfig = ({ dataset, datasetValues, params_config }: UseConfig) => {
  const datasetValueT = dataset?.data?.attributes?.value_type;
  const isResource = datasetValueT === "resource";
  const useParamsConfig =
    Array.isArray(params_config) &&
    params_config?.some((c) => c.key === "minValue" || c.key === "maxValue");

  if (isResource && useParamsConfig) {
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

    const paramsConfig = params_config?.map((p) => {
      return p.key === "minValue"
        ? { ...p, default: maxMin?.minValue }
        : p.key === "maxValue"
        ? { ...p, default: maxMin?.maxValue }
        : p;
    });
    return paramsConfig;
  }
  return params_config;
};
