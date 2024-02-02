"use client";

import { cn } from "@/lib/classnames";
import { formatNumber } from "@/lib/utils/formats";

import { useGetCountries } from "@/types/generated/country";
import { useGetDatasets } from "@/types/generated/dataset";

import { useSyncCountriesComparison, useSyncCountry, useSyncDatasets } from "@/app/store";

import CountryDataDialog from "@/containers/countries/data-dialog";
import CountryDownloadDialog from "@/containers/countries/download-dialog";
import { MultiCombobox } from "@/containers/countries/multicombobox";
import Popup from "@/containers/popup";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const CountryPopup = () => {
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

  const COUNTRY = countriesData?.data?.find((c) => c.attributes?.iso3 === country);

  const TABLE_COLUMNS_DATA = [country, ...countriesComparison]
    .map((c) => {
      const C = countriesData?.data?.find((c1) => c1.attributes?.iso3 === c);

      return C?.attributes?.name;
    })
    .filter((c) => !!c)
    .sort((a, b) => {
      if (!a || !b) return 0;
      return a.localeCompare(b);
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
        <section className="space-y-2.5">
          <h3 className="text-xxs uppercase text-gray-500">Data</h3>
          <MultiCombobox />

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

          <div className="flex space-x-2.5">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="primary-outline">Open Table detail</Button>
              </DialogTrigger>
              <DialogContent className="block max-w-[90svw] md:w-auto">
                <CountryDataDialog />
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="primary-outline">Download data</Button>
              </DialogTrigger>
              <DialogContent className="block max-w-[90svw] md:w-auto">
                <CountryDownloadDialog />
              </DialogContent>
            </Dialog>
          </div>
        </section>
      </div>
    </Popup>
  );
};

export default CountryPopup;
