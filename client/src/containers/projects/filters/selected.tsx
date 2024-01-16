"use client";

import { LuX } from "react-icons/lu";

import { useGetCountries } from "@/types/generated/country";
import { useGetPillars } from "@/types/generated/pillar";

import { useSyncCountries, useSyncPillars } from "@/app/store";

import { GET_COUNTRIES_OPTIONS } from "@/constants/countries";
import { GET_PILLARS_OPTIONS } from "@/constants/pillars";

const ProjectsSelected = () => {
  const [pillars, setPillars] = useSyncPillars();
  const [countries, setCountries] = useSyncCountries();

  const { data: pillarsData } = useGetPillars(GET_PILLARS_OPTIONS);
  const { data: countriesData } = useGetCountries(GET_COUNTRIES_OPTIONS);

  if (!pillars.length && !countries.length) return null;

  return (
    <div className="space-y-2.5">
      <h3 className="text-xxs uppercase text-gray-400">Filter by</h3>
      <div className="flex flex-wrap gap-1">
        {pillars?.map((p) => {
          const pillar = pillarsData?.data?.find((pi) => pi.id === p);

          return (
            <span
              key={p}
              className="inline-flex items-center justify-center rounded-full border border-green-500 bg-green-50 px-2.5 py-1 text-xs"
            >
              <span>{pillar?.attributes?.name}</span>
              <button
                type="button"
                className="ml-1.5 flex h-4 w-4 items-center justify-center rounded-full border border-green-500"
                onClick={() => {
                  setPillars(pillars.filter((pi) => pi !== p));
                }}
              >
                <LuX className="h-2.5 w-2.5" />
              </button>
            </span>
          );
        })}

        {countries.map((c) => {
          const country = countriesData?.data?.find((c1) => c1.attributes?.iso3 === c);

          return (
            <span
              key={c}
              className="inline-flex items-center justify-center rounded-full border border-green-500 bg-green-50 px-2.5 py-1 text-xs"
            >
              <span>{country?.attributes?.name}</span>
              <button
                type="button"
                className="ml-1.5 flex h-4 w-4 items-center justify-center rounded-full border border-green-500"
                onClick={() => {
                  setCountries(countries.filter((ci) => ci !== c));
                }}
              >
                <LuX className="h-2.5 w-2.5" />
              </button>
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectsSelected;
