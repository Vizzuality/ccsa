"use client";

import { cn } from "@/lib/classnames";

import { useGetCountries } from "@/types/generated/country";
import { useGetDatasets } from "@/types/generated/dataset";

import { useSyncCountry, useSyncDatasets } from "@/app/store";

import Popup from "@/containers/popup";

const CountryPopup = () => {
  const [country] = useSyncCountry();
  const [datasets] = useSyncDatasets();

  const { data: countriesData } = useGetCountries({
    "pagination[pageSize]": 100,
    sort: "name:asc",
  });

  const { data: datasetsData } = useGetDatasets(
    {
      filters: {
        id: datasets,
      },
    },
    {
      query: {
        enabled: !!datasets && !!datasets.length,
        keepPreviousData: !!datasets && !!datasets.length,
      },
    },
  );

  const COUNTRY = countriesData?.data?.find((c) => c.attributes?.iso3 === country);

  const TABLE_ROWS_DATA = datasetsData?.data
    ?.sort((a, b) => {
      if (!a.id || !b.id) return 0;
      return datasets.indexOf(b.id) - datasets.indexOf(a.id);
    })
    ?.map((d) => {
      const { id, attributes } = d;
      const value = (attributes?.datum as Record<string, string | number>[]).find(
        (d1) => d1.iso3 === COUNTRY?.attributes?.iso3,
      );

      return {
        id,
        name: attributes?.name,
        value: value?.emissions,
      };
    });

  return (
    <Popup visibleKey={country}>
      <header
        className={cn({
          "space-y-5 bg-gradient-to-r px-10 py-12": true,
          "from-gray-200 to-gray-100": true,
        })}
      >
        <h3 className="text-xxs uppercase">Country selected</h3>
        <h2 className="font-metropolis text-3xl">{COUNTRY?.attributes?.name}</h2>
      </header>

      <div className="divide-y divide-gray-200 px-10 py-5">
        {!!TABLE_ROWS_DATA && !!TABLE_ROWS_DATA.length && (
          <table className="w-full">
            <thead>
              <tr>
                <th className="py-3 text-left">
                  <span className="text-sm leading-none"></span>
                </th>
                <th className="py-3 text-left">
                  <span className="text-sm leading-none">{COUNTRY?.attributes?.iso3}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {TABLE_ROWS_DATA?.map((t) => {
                return (
                  <tr key={t?.id} className="border-t">
                    <td className="py-3">
                      <span className="text-sm leading-none">{t?.name}</span>
                    </td>
                    <td className="py-3">
                      <span className="text-sm leading-none">{t?.value ?? "-"}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </Popup>
  );
};

export default CountryPopup;
