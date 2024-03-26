"use client";

import { formatNumber } from "@/lib/utils/formats";

import { useGetCountries } from "@/types/generated/country";

import { useSyncCountriesComparison, useSyncCountry, useSyncDatasets } from "@/app/store";
import { useGetDatasetValues } from "@/types/generated/dataset-value";
import { groupBy } from "lodash-es";
import { useMemo } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DatasetValueResourcesDataItemAttributes } from "@/types/generated/strapi.schemas";

const CountryDataDialog = () => {
  const [country] = useSyncCountry();
  const [countriesComparison] = useSyncCountriesComparison();
  const [datasets] = useSyncDatasets();

  const { data: countriesData } = useGetCountries({
    "pagination[pageSize]": 100,
    sort: "name:asc",
  });

  const { data: datasetValueData } = useGetDatasetValues(
    {
      filters: {
        dataset: { id: { $in: datasets } },
        country: { iso3: { $in: [country, ...countriesComparison] } },
      },
      populate: "dataset,country,resources",
    },
    {
      query: {
        enabled: !!datasets.length,
        keepPreviousData: !!datasets && !!datasets.length,
      },
    },
  );

  const countries = [country, ...countriesComparison].sort((a, b) => {
    if (!a || !b) return 0;
    return a.localeCompare(b);
  });

  const TABLE_COLUMNS_DATA = countries.map((c) => {
    const C = countriesData?.data?.find((c1) => c1.attributes?.iso3 === c);

    return C?.attributes?.name;
  });

  const TABLE_ROWS_DATA = useMemo(() => {
    const dataSetGroups = groupBy(datasetValueData?.data, "attributes.dataset.data.id");
    return Object.entries(dataSetGroups).map(([key, values]) => {
      const dataset = values?.[0]?.attributes?.dataset?.data?.attributes;
      const dataType = dataset?.value_type;

      return {
        id: key,
        unit: dataset?.unit,
        name: dataset?.name,
        values: countries.map((c) => {
          const countryValue = values.find(
            (v) => v?.attributes?.country?.data?.attributes?.iso3 === c,
          )?.attributes;

          const resources = countryValue?.resources?.data;
          const value = resources?.length
            ? resources.map((r) => r.attributes)
            : countryValue && dataType
            ? countryValue[`value_${dataType}`]
            : [];
          return {
            value,
            iso3: c,
            isResource: !!resources?.length,
          };
        }),
      };
    });
  }, [datasetValueData?.data]);

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
                          <td key={v.iso3} className="space-y-1.5 p-3">
                            {v.isResource ? (
                              (v.value as DatasetValueResourcesDataItemAttributes[])?.map((r) => (
                                <Popover key={r.link_title}>
                                  <PopoverTrigger className="whitespace-nowrap rounded border border-brand1 bg-brand1/20 px-2.5 data-[state='open']:bg-brand1">
                                    {r.link_title}
                                  </PopoverTrigger>
                                  <PopoverContent>
                                    <div className="space-y-2 p-3">
                                      <h4 className="text-sm font-bold">{r.link_title}</h4>
                                      <p className="text-sm">{r.description}</p>
                                      <p className="text-sm">{r.link_url}</p>
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              ))
                            ) : (
                              <span className="whitespace-nowrap text-sm leading-none">
                                {v.value ? formatNumber(v.value) : "-"}
                              </span>
                            )}
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
