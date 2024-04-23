"use client";
import Flag from "react-world-flags";

import { cn } from "@/lib/classnames";

import { useGetCountries } from "@/types/generated/country";

import { useSyncCountriesComparison, useSyncCountry } from "@/app/store";

import CountryDataDialog from "@/containers/countries/data-dialog";
import CountryDownloadDialog from "@/containers/countries/download-dialog";
import { MultiCombobox } from "@/containers/countries/multicombobox";
import Popup from "@/containers/popup";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import CountriesTable from "./countries-table";

const CountryPopup = () => {
  const [country] = useSyncCountry();
  const [countriesComparison, setComparisonCountries] = useSyncCountriesComparison();

  const { data: countriesData } = useGetCountries({
    "pagination[pageSize]": 100,
    sort: "name:asc",
  });

  const COUNTRY = countriesData?.data?.find((c) => c.attributes?.iso3 === country);

  return (
    <Popup visibleKey={country}>
      <header
        className={cn({
          "space-y-5 px-10 pt-[30px]": true,
        })}
      >
        <h3 className="font-open-sans text-xxs font-semibold uppercase text-gray-400">
          Country selected
        </h3>
        {!countriesComparison?.length && (
          <div className="flex items-center gap-3">
            {!!country && <Flag code={country} className="h-5 w-8 rounded" />}
            <h2 className="font-open text-xl text-gray-700">{COUNTRY?.attributes?.name}</h2>
          </div>
        )}
      </header>

      <div className="divide-y divide-gray-200 px-10 py-5">
        <section className="space-y-2.5">
          <div className="flex gap-2">
            <MultiCombobox />
            {!!countriesComparison?.length && (
              <Button onClick={() => setComparisonCountries([])} variant="destructive-outline">
                Clear
              </Button>
            )}
          </div>

          <CountriesTable />

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
