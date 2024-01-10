"use client";

import { formatNumber } from "@/lib/utils/formats";

import { useGetCountries } from "@/types/generated/country";
import { useGetDatasets } from "@/types/generated/dataset";

import { useSyncCountriesComparison, useSyncCountry, useSyncDatasets } from "@/app/store";

const CountryDataDialog = () => {
  const [country] = useSyncCountry();
  const [countriesComparison] = useSyncCountriesComparison();
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

  const TABLE_COLUMNS_DATA = [country, ...countriesComparison].map((c) => {
    const C = countriesData?.data?.find((c1) => c1.attributes?.iso3 === c);

    return C?.attributes?.name;
  });

  const TABLE_ROWS_DATA = datasetsData?.data
    ?.sort((a, b) => {
      if (!a.id || !b.id) return 0;
      return datasets.indexOf(b.id) - datasets.indexOf(a.id);
    })
    ?.map((d) => {
      const { id, attributes } = d;
      const values = (attributes?.datum as Record<string, string | number>[]).filter((d1) =>
        [country, ...countriesComparison].includes(`${d1.iso3}`),
      );

      return {
        id,
        unit: attributes?.unit,
        name: attributes?.name,
        values,
      };
    });

  return (
    <div className="max-h-[90svh] overflow-auto p-10">
      <section className="space-y-2.5">
        <div className="w-full overflow-auto">
          {!!TABLE_ROWS_DATA && !!TABLE_ROWS_DATA.length && (
            <table>
              <thead>
                <tr>
                  <th className="py-3 pr-3 text-left">
                    <span className="text-sm leading-none"></span>
                  </th>
                  {TABLE_COLUMNS_DATA?.map((c) => {
                    return (
                      <th key={c} className="p-3 text-left">
                        <span className="whitespace-nowrap text-sm leading-none">{c}</span>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody>
                {TABLE_ROWS_DATA?.map((t) => {
                  return (
                    <tr key={t?.id} className="border-t">
                      <td className="py-3 pr-3">
                        <span className="whitespace-nowrap text-sm leading-none">
                          {t?.name} {!!t?.unit ? `(${t?.unit})` : ""}
                        </span>
                      </td>
                      {t?.values?.map((v) => {
                        return (
                          <td key={v.iso3} className="p-3">
                            <span className="whitespace-nowrap text-sm leading-none">
                              {v.value ? formatNumber(v.value) : "-"}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
};

export default CountryDataDialog;
