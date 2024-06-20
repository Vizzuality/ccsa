"use client";

import { useSyncCountry } from "@/app/store";

import CountryDetail from "@/containers/countries/countries-detail";
import Popup from "@/containers/popup";

const CountryPopup = () => {
  const [country] = useSyncCountry();

  return (
    <Popup visibleKey={country}>
      <CountryDetail />
    </Popup>
  );
};

export default CountryPopup;
