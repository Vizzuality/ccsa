import { parseAsArrayOf, parseAsFloat, parseAsInteger, useQueryState } from "next-usequerystate";
import { parseAsJson } from "next-usequerystate/parsers";

import { DEFAULT_BBOX, DEFAULT_MAP_SETTINGS } from "@/constants/map";

export const useSyncLayers = () => {
  return useQueryState("layers", parseAsArrayOf(parseAsInteger).withDefault([]));
};

export const useSyncLayersSettings = () => {
  return useQueryState(
    "layers-settings",
    parseAsJson<{
      [key: string]: Record<string, unknown>;
    }>(),
  );
};

export const useSyncBbox = () => {
  return useQueryState("bbox", parseAsArrayOf(parseAsFloat).withDefault(DEFAULT_BBOX));
};

export const useSyncMapSettings = () => {
  return useQueryState(
    "mapSettings",
    parseAsJson<typeof DEFAULT_MAP_SETTINGS>().withDefault(DEFAULT_MAP_SETTINGS),
  );
};
