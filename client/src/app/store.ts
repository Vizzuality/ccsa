import { atom } from "jotai";
import { useQueryState } from "next-usequerystate";

import {
  availableForFundingParser,
  bboxParser,
  countriesComparisonParser,
  countryParser,
  datasetsParser,
  layersParser,
  layersSettingsParser,
  mapSettingsParser,
  countriesParser,
  pillarsParser,
  publicationStateParser,
  projectParser,
  datasetStepParser,
} from "@/app/parsers";

import { Data, DatasetValuesCSV } from "@/components/forms/dataset/types";

export const INITIAL_DATASET_VALUES: Data = {
  settings: {
    name: "",
    value_type: undefined,
    category: undefined,
    unit: "",
    description: "",
  },
  data: {},
  colors: {},
};

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

export const useSyncCountries = () => {
  return useQueryState("countries", countriesParser);
};

export const useSyncPillars = () => {
  return useQueryState("pillars", pillarsParser);
};

export const useSyncAvailableForFunding = () => {
  return useQueryState("available_for_funding", availableForFundingParser);
};

export const useSyncPublicationState = () => {
  return useQueryState("publicationState", publicationStateParser);
};

export const useSyncOtherToolsSearch = () => {
  return useQueryState("other-tools-search", { defaultValue: "" });
};

export const useSyncDatasetStep = () => {
  return useQueryState("step", datasetStepParser);
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
  const [countries] = useSyncCountries();
  const [availableForFunding] = useSyncAvailableForFunding();
  const [publicationState] = useSyncPublicationState();
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
  if (!!country) sp.set("country", countryParser.serialize(country));

  if (countriesComparisonParser.defaultValue !== countriesComparison)
    sp.set("countries-comparison", countriesComparisonParser.serialize(countriesComparison));

  // Project
  if (project) sp.set("project", projectParser.serialize(project));
  if (pillarsParser.defaultValue !== pillars) sp.set("pillars", pillarsParser.serialize(pillars));
  if (countriesParser.defaultValue !== countries)
    sp.set("countries", countriesParser.serialize(countries));

  // Available for funding
  if (availableForFundingParser.defaultValue !== availableForFunding) {
    sp.set("available_for_funding", availableForFundingParser.serialize(!!availableForFunding));
  }

  // Preview
  if (publicationStateParser.defaultValue !== publicationState)
    sp.set("publicationState", publicationStateParser.serialize(publicationState));

  return sp;
};

export const datasetSearchAtom = atom<string | undefined>(undefined);

export const projectSearchAtom = atom<string | undefined>(undefined);

export const layersInteractiveAtom = atom<(number | string)[]>([]);
export const layersInteractiveIdsAtom = atom<(number | string)[]>([]);

export const otherToolsSearchAtom = atom<string | undefined>(undefined);
export const collaboratorsSearchAtom = atom<string | undefined>(undefined);

export const personalDetailsAtom = atom<"account" | "changes">("changes");

export const datasetStepAtom = atom<number>(1);

export const datasetValuesAtom = atom<Data>(INITIAL_DATASET_VALUES);

export const datasetValuesJsonUploadedAtom = atom<DatasetValuesCSV[]>([]);
