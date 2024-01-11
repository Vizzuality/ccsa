/* eslint-disable @typescript-eslint/no-var-requires */
import React from "react";

import { JSONConfiguration, JSONConverter } from "@deck.gl/json/typed";

import FUNCTIONS from "@/lib/utils";

import { ParamsConfig } from "@/types/layers";

import LegendTreeCoverLoss from "@/containers/map/legend/custom/tree-cover-loss";

import DecodeLayer from "@/components/map/layers/decode-layer";
import DecodeLayerComponent from "@/components/map/layers/decode-layer/component";
import RingLayerComponent from "@/components/map/layers/ring-layer/component";
import TestLayerComponent from "@/components/map/layers/test-layer/component";
import {
  LegendTypeBasic,
  LegendTypeChoropleth,
  LegendTypeGradient,
} from "@/components/map/legend/item-types";

export const JSON_CONFIGURATION = new JSONConfiguration({
  React,
  classes: Object.assign(
    //
    {},
    require("@deck.gl/layers"),
    require("@deck.gl/aggregation-layers"),
    { DecodeLayer },
  ),
  functions: FUNCTIONS,
  enumerations: {},
  reactComponents: {
    DecodeLayerComponent,
    RingLayerComponent,
    TestLayerComponent,
    LegendTypeBasic,
    LegendTypeChoropleth,
    LegendTypeGradient,
    LegendTreeCoverLoss,
  },
});

/**
 * *`getParams`*
 * Get params from params_config
 * @param {Object} params_config
 * @returns {Object} params
 *
 */
export interface GetParamsProps {
  settings: Record<string, unknown>;
  params_config: ParamsConfig;
}
export const getParams = ({ params_config, settings = {} }: GetParamsProps) => {
  if (!params_config) {
    return {};
  }
  return params_config.reduce(
    (acc, p) => {
      return {
        ...acc,
        [`${p.key}`]: settings[`${p.key}`] ?? p.default,
      };
    },
    {} as Record<string, unknown>,
  );
};

/**
 * *`parseConfig`*
 * Parse config with params_config
 * @param {Object} config
 * @param {Object} params_config
 * @returns {Object} config
 *
 */
interface ParseConfigurationProps {
  config: unknown;
  params_config: unknown;
  settings: Record<string, unknown>;
}
export const parseConfig = <T>({
  config,
  params_config,
  settings,
}: ParseConfigurationProps): T | null => {
  if (!config || !params_config) {
    return null;
  }

  const JSON_CONVERTER = new JSONConverter({
    configuration: JSON_CONFIGURATION,
  });

  const pc = params_config as ParamsConfig;
  const params = getParams({ params_config: pc, settings });
  // Merge enumerations with config
  JSON_CONVERTER.mergeConfiguration({
    enumerations: {
      params,
    },
  });
  return JSON_CONVERTER.convert(config);
};
