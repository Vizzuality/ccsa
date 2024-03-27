"use client";

import { cn } from "@/lib/classnames";
import { formatNumber } from "@/lib/utils/formats";

import { useGetCountries } from "@/types/generated/country";
import { DatasetValueResourcesDataItemAttributes } from "@/types/generated/strapi.schemas";

import { useSyncCountry } from "@/app/store";

import CountryDataDialog from "@/containers/countries/data-dialog";
import CountryDownloadDialog from "@/containers/countries/download-dialog";
import { MultiCombobox } from "@/containers/countries/multicombobox";
import Popup from "@/containers/popup";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import useTableData from "./utils";

const CountryPopup = () => {
  const [country] = useSyncCountry();

  const { data: countriesData } = useGetCountries({
    "pagination[pageSize]": 100,
    sort: "name:asc",
  });

  const COUNTRY = countriesData?.data?.find((c) => c.attributes?.iso3 === country);

  const { TABLE_COLUMNS_DATA, TABLE_ROWS_DATA } = useTableData();

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
