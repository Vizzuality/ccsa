import { useQueryState } from "next-usequerystate";
import { parseAsJson } from "next-usequerystate/parsers";

import { DEFAULT_MAP_SETTINGS } from "@/components/map/constants";

export const useSyncMapSettings = () => {
  return useQueryState(
    "mapSettings",
    parseAsJson<typeof DEFAULT_MAP_SETTINGS>().withDefault(DEFAULT_MAP_SETTINGS),
  );
};
