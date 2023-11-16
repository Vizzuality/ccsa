import { atom } from "jotai";
import {
  parseAsArrayOf,
  parseAsFloat,
  parseAsInteger,
  parseAsString,
  useQueryState,
} from "next-usequerystate";
import { parseAsJson } from "next-usequerystate/parsers";

import { DEFAULT_BBOX, DEFAULT_MAP_SETTINGS } from "@/constants/map";

const datasetsParser = parseAsArrayOf(parseAsInteger).withDefault([]);
export const useSyncDatasets = () => {
  return useQueryState("datasets", datasetsParser);
};

const layersParser = parseAsArrayOf(parseAsInteger).withDefault([]);
export const useSyncLayers = () => {
  return useQueryState("layers", layersParser);
};

const layersSettingsParser = parseAsJson<{
  [key: string]: Record<string, unknown>;
}>();
export const useSyncLayersSettings = () => {
  return useQueryState("layers-settings", layersSettingsParser);
};

const bboxParser = parseAsArrayOf(parseAsFloat).withDefault(DEFAULT_BBOX);
export const useSyncBbox = () => {
  return useQueryState("bbox", bboxParser);
};

const mapSettingsParser =
  parseAsJson<typeof DEFAULT_MAP_SETTINGS>().withDefault(DEFAULT_MAP_SETTINGS);
export const useSyncMapSettings = () => {
  return useQueryState("map-settings", mapSettingsParser);
};

const countryParser = parseAsString.withDefault("");
export const useSyncCountry = () => {
  return useQueryState("country", countryParser);
};

const countriesComparisonParser = parseAsArrayOf(parseAsString).withDefault([]);
export const useSyncCountriesComparison = () => {
  return useQueryState("countries-comparison", countriesComparisonParser);
};

export const useSyncProject = () => {
  return useQueryState("project", parseAsInteger);
};
const pillarsParser = parseAsArrayOf(parseAsInteger).withDefault([]);
export const useSyncPillars = () => {
  return useQueryState("pillars", pillarsParser);
};

export const useSyncSearchParams = () => {
  const [datasets] = useSyncDatasets();
  const [layers] = useSyncLayers();
  const [layersSettings] = useSyncLayersSettings();
  const [bbox] = useSyncBbox();
  const [mapSettings] = useSyncMapSettings();
  const [country] = useSyncCountry();
  const [countriesComparison] = useSyncCountriesComparison();
  const [project] = useSyncProject();
  const [pillars] = useSyncPillars();

  const sp = new URLSearchParams();

  // Datatsets
  if (datasetsParser.defaultValue !== datasets)
    sp.set("datasets", datasetsParser.serialize(datasets));

  // Layers
  if (layersParser.defaultValue !== layers) sp.set("layers", layersParser.serialize(layers));
  if (layersSettings) sp.set("layers-settings", layersSettingsParser.serialize(layersSettings));

  // Map
  if (bboxParser.defaultValue !== bbox) sp.set("bbox", bboxParser.serialize(bbox));
  if (mapSettingsParser.defaultValue !== mapSettings)
    sp.set("map-settings", mapSettingsParser.serialize(mapSettings));

  // Countries
  if (countryParser.defaultValue !== country) sp.set("country", countryParser.serialize(country));
  if (countriesComparisonParser.defaultValue !== countriesComparison)
    sp.set("countries-comparison", countriesComparisonParser.serialize(countriesComparison));

  // Project
  if (project) sp.set("project", parseAsInteger.serialize(project));
  if (pillarsParser.defaultValue !== pillars) sp.set("pillars", pillarsParser.serialize(pillars));

  return sp;
};

export const datasetSearchAtom = atom<string | undefined>(undefined);

export const projectSearchAtom = atom<string | undefined>(undefined);

export const layersInteractiveAtom = atom<(number | string)[]>([]);
export const layersInteractiveIdsAtom = atom<(number | string)[]>([]);
