import {
  parseAsArrayOf,
  parseAsFloat,
  parseAsInteger,
  parseAsString,
  parseAsJson,
} from "next-usequerystate/parsers";

import { DEFAULT_BBOX, DEFAULT_MAP_SETTINGS } from "@/constants/map";

export const datasetsParser = parseAsArrayOf(parseAsInteger).withDefault([]);

export const layersParser = parseAsArrayOf(parseAsInteger).withDefault([]);
export const layersSettingsParser = parseAsJson<{
  [key: string]: Record<string, unknown>;
}>();

export const bboxParser = parseAsArrayOf(parseAsFloat).withDefault(DEFAULT_BBOX);
export const mapSettingsParser =
  parseAsJson<typeof DEFAULT_MAP_SETTINGS>().withDefault(DEFAULT_MAP_SETTINGS);

export const countryParser = parseAsString.withDefault("");
export const countriesComparisonParser = parseAsArrayOf(parseAsString).withDefault([]);

export const projectParser = parseAsInteger;
export const pillarsParser = parseAsArrayOf(parseAsInteger).withDefault([]);