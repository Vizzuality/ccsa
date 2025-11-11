"use client";

import { useEffect, useMemo } from "react";

import { Source, Layer, GeoJSONSourceRaw } from "react-map-gl";

import centroid from "@turf/centroid";
import { Feature } from "geojson";
import { useAtomValue } from "jotai";

import { useGetCountries } from "@/types/generated/country";
import { useGetProjects } from "@/types/generated/project";
import { Config, LayerProps } from "@/types/layers";

import { projectSearchAtom, useSyncCountries, useSyncPillars } from "@/app/store";

import { GET_PROJECTS_OPTIONS } from "@/constants/projects";

import qs from "qs";

export type ProjectsLayerProps = LayerProps & {
  config: Config;
  beforeId?: string;
};

const ProjectsLayer = ({ id, beforeId, config, onAdd, onRemove }: ProjectsLayerProps) => {
  const projectSearch = useAtomValue(projectSearchAtom);
  const [pillars] = useSyncPillars();
  const [countries] = useSyncCountries();

  const { data: projectsData } = useGetProjects(
    GET_PROJECTS_OPTIONS(projectSearch, {
      pillars,
      countries,
    }),
    {
      query: {
        keepPreviousData: true,
      },
      request: {
        paramsSerializer: (params) => qs.stringify(params, { encodeValuesOnly: true }),
      },
    },
  );
  const { data: countriesData } = useGetCountries({
    "pagination[pageSize]": 100,
    sort: "name:asc",
  });

  const SOURCE = useMemo(() => {
    if (!projectsData?.data || !countriesData?.data) return null;

    return {
      // @ts-expect-error GeoJSONSourceRaw doesn't have id but it works
      id: `${id}-source`,
      type: "geojson",
      promoteId: "id",
      data: {
        type: "FeatureCollection",
        features: countriesData.data
          .filter((c) => {
            return projectsData?.data?.filter(
              (p) => p.attributes?.countries?.data?.map((c1) => c1.id).includes(c.id),
            ).length;
          })
          .filter((c) => {
            if (countries?.length) {
              return countries.includes(`${c.attributes?.iso3}`);
            }
            return true;
          })
          .map((c) => {
            const CENTROID = centroid(c.attributes?.geometry as Feature["geometry"]);

            return {
              type: "Feature",
              id: c.id,
              geometry: CENTROID.geometry,
              properties: {
                id: c.id,
                name: c.attributes?.name,
                iso3: c.attributes?.iso3,
                projects:
                  projectsData?.data?.filter(
                    (p) => p.attributes?.countries?.data?.map((c1) => c1.id).includes(c.id),
                  ).length || 0,
              },
            };
          }),
      },
    } satisfies GeoJSONSourceRaw;
  }, [id, countries, countriesData, projectsData]);

  const STYLES = config.styles;

  useEffect(() => {
    if (SOURCE && STYLES && onAdd) {
      onAdd({
        source: SOURCE,
        styles: STYLES,
      });
    }

    return () => {
      if (SOURCE && STYLES && onRemove) {
        onRemove({
          source: SOURCE,
          styles: STYLES,
        });
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!SOURCE || !STYLES) return null;

  return (
    <Source {...SOURCE}>
      {STYLES.map((layer) => (
        <Layer key={layer.id} {...layer} beforeId={beforeId} />
      ))}
    </Source>
  );
};

export default ProjectsLayer;
