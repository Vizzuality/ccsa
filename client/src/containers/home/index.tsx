"use client";

import { useGetCountries } from "@/types/generated/country";

const Home = (): JSX.Element => {
  const { data: countriesData } = useGetCountries({
    "pagination[pageSize]": 100,
  });

  return (
    <div className="flex h-full overflow-auto">
      <div className="p-5">
        <h1 className="text-3xl">Explore datasets</h1>

        <ul className="mt-5">
          {countriesData?.data?.data?.map((country) => (
            <li key={country.id}>{country.attributes?.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;
