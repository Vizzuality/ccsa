import { atom } from "jotai";
import { useQueryState } from "next-usequerystate";

import {
  bboxParser,
  countriesComparisonParser,
  countryParser,
  datasetsParser,
  layersParser,
  layersSettingsParser,
  mapSettingsParser,
  pillarsParser,
  projectParser,
} from "@/app/parsers";

export const useSyncDatasets = () => {
  return useQueryState("datasets", datasetsParser);
};

export const useSyncLayers = () => {
  return useQueryState("layers", layersParser);
};

export const useSyncLayersSettings = () => {
  return useQueryState("layers-settings", layersSettingsParser);
};

export const useSyncBbox = () => {
  return useQueryState("bbox", bboxParser);
};

export const useSyncMapSettings = () => {
  return useQueryState("map-settings", mapSettingsParser);
};

export const useSyncCountry = () => {
  return useQueryState("country", countryParser);
};

export const useSyncCountriesComparison = () => {
  return useQueryState("countries-comparison", countriesComparisonParser);
};

export const useSyncProject = () => {
  return useQueryState("project", projectParser);
};

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
  if (project) sp.set("project", projectParser.serialize(project));
  if (pillarsParser.defaultValue !== pillars) sp.set("pillars", pillarsParser.serialize(pillars));

  return sp;
};

export const datasetSearchAtom = atom<string | undefined>(undefined);

export const projectSearchAtom = atom<string | undefined>(undefined);

export const layersInteractiveAtom = atom<(number | string)[]>([]);
export const layersInteractiveIdsAtom = atom<(number | string)[]>([]);
