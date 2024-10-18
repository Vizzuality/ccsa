"use client";
import CountryDetail from "@/containers/countries/countries-detail";
import Popup from "@/containers/popup";

import { useSyncCountry } from "@/app/store";

export default function EmbedPage() {
  const [country] = useSyncCountry();

  return (
    <Popup visibleKey={country} className="left-0 z-10">
      <div className=" max-w-md xl:max-w-xl 2xl:max-w-4xl">
        <CountryDetail embed />
      </div>
    </Popup>
  );
}
