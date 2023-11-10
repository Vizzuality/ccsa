"use client";

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
      <div>
        <h3 className="text-xxs uppercase text-gray-500">Country selected</h3>
        <h2 className="text-xl">{COUNTRY?.attributes?.name}</h2>
      </div>
    </Popup>
  );
};

export default CountryPopup;
