"use client";

import CountriesTable from "./countries-table";

const CountryDataDialog = () => {
  return (
    <div className="max-h-[90svh] overflow-auto p-10">
      <section className="space-y-2.5">
        <div className="w-full overflow-auto">
          <CountriesTable />
        </div>
      </section>
    </div>
  );
};

export default CountryDataDialog;
