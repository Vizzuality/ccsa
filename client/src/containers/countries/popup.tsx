"use client";

import { cn } from "@/lib/classnames";

import { useGetCountries } from "@/types/generated/country";

import { useSyncCountry } from "@/app/store";

import Popup from "@/containers/popup";

const CountryPopup = () => {
  const [country] = useSyncCountry();

  const { data: countriesData } = useGetCountries({
    "pagination[pageSize]": 100,
    sort: "name:asc",
  });

  const COUNTRY = countriesData?.data?.find((c) => c.attributes?.iso3 === country);

  return (
    <Popup visibleKey={country}>
      <header
        className={cn({
          "space-y-5 bg-gradient-to-r px-10 py-12": true,
        })}
      >
        <h3 className="text-xxs uppercase">Country selected</h3>
        <h2 className="font-metropolis text-3xl">{COUNTRY?.attributes?.name}</h2>
      </header>
    </Popup>
  );
};

export default CountryPopup;
