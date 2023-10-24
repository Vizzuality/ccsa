import { parseAsArrayOf, parseAsFloat, useQueryState } from "next-usequerystate";
import { parseAsJson } from "next-usequerystate/parsers";

import { DEFAULT_BBOX, DEFAULT_MAP_SETTINGS } from "@/constants/map";

export const useSyncBbox = () => {
  return useQueryState("bbox", parseAsArrayOf(parseAsFloat).withDefault(DEFAULT_BBOX));
};

export const useSyncMapSettings = () => {
  return useQueryState(
    "mapSettings",
    parseAsJson<typeof DEFAULT_MAP_SETTINGS>().withDefault(DEFAULT_MAP_SETTINGS),
  );
};
