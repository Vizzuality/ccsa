import {
  parseAsArrayOf,
  parseAsFloat,
  parseAsInteger,
  parseAsString,
  parseAsJson,
  parseAsBoolean,
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

export const countryParser = parseAsString;
export const countriesComparisonParser = parseAsArrayOf(parseAsString).withDefault([]);

export const projectParser = parseAsInteger;
export const pillarsParser = parseAsArrayOf(parseAsInteger).withDefault([]);
export const availableForFundingParser = parseAsBoolean.withDefault(false);
export const countriesParser = parseAsArrayOf(parseAsString).withDefault([]);
export const publicationStateParser = parseAsString.withDefault("live");
export const datasetStepParser = parseAsInteger.withDefault(1);
