import type { ViewState } from "react-map-gl";

export const DEFAULT_VIEW_STATE: Partial<ViewState> = {
  zoom: 2,
  latitude: 0,
  longitude: 0,
};

export const DEFAULT_BBOX: [number, number, number, number] = [
  -118.3665 * 1.1,
  1.1768 * 1.1,
  -53.9775 * 1.1,
  32.7186 * 1.1,
];

export const BASEMAPS = [
  {
    label: "Light",
    value: "basemap-light" as const,
    preview: `/images/map/light.jpeg`,
    settings: {
      labels: "labels-dark",
      boundaries: "boundaries-dark",
      roads: "roads-dark",
    },
  },
  {
    label: "Satellite",
    value: "basemap-satellite" as const,
    preview: `/images/map/satellite.jpeg`,
    settings: {
      labels: "labels-light",
      boundaries: "boundaries-light",
      roads: "roads-light",
    },
  },
];

export const LABELS = [
  {
    id: "1059d2b8cfa87b8d894b5373ea556666",
    label: "Dark labels",
    slug: "labels-dark" as const,
  },
  {
    id: "5924e7eeda116f817dd89f1d8d418721",
    label: "Light labels",
    slug: "labels-light" as const,
  },
  {
    id: "asdfasdfasdfasdf",
    label: "No labels",
    slug: "labels-none" as const,
  },
];

export const BOUNDARIES = [
  {
    id: "ae861f3122c21ad7754e66d3cead38e6",
    label: "Dark boundaries",
    slug: "boundaries-dark",
  },
  {
    id: "31b240eba06a254ade36f1dde6a3c07e",
    label: "Light boundaries",
    slug: "boundaries-light",
  },
];

export const ROADS = [
  {
    id: "4e240a8b884456747dcd07d41b4d5543",
    label: "Dark roads",
    slug: "roads-dark",
  },
  {
    id: "edb80ef589e776ec6c2568b2fc6ad74c",
    label: "Light roads",
    slug: "roads-light",
  },
];

export const DEFAULT_MAP_SETTINGS: {
  basemap: (typeof BASEMAPS)[number]["value"];
  labels: (typeof LABELS)[number]["slug"];
  boundaries: boolean;
  roads: boolean;
} = {
  basemap: "basemap-light",
  labels: "labels-dark",
  boundaries: true,
  roads: true,
};
