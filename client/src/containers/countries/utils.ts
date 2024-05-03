import { isDatasetValueProperty } from "@/lib/datasets";

import { useGetCountries } from "@/types/generated/country";
import { useGetDatasets } from "@/types/generated/dataset";
import { useGetDatasetValues } from "@/types/generated/dataset-value";
import { DatasetValueResourcesDataItemAttributes } from "@/types/generated/strapi.schemas";

import {
  useSyncCountry,
  useSyncCountriesComparison,
  useSyncDatasets,
  useSyncPublicationState,
} from "@/app/store";

type TableRowsDataItem = {
  id: number;
  unit?: string;
  name?: string;
  values: {
    iso3: string;
    countryLink?: string;
    countryName?: string;
    isResource: boolean;
    resources?: DatasetValueResourcesDataItemAttributes[];
    value: string | number | boolean | undefined;
  }[];
};

const useTableData = () => {
  const [country] = useSyncCountry();
  const [countriesComparison] = useSyncCountriesComparison();
  const [datasets] = useSyncDatasets();
  const [publicationState] = useSyncPublicationState();

  const { data: countriesData } = useGetCountries({
    "pagination[pageSize]": 100,
    sort: "name:asc",
  });

  const getDatasetParams = {
    params: {
      publicationState,
      "pagination[pageSize]": 300,
    },
    options: {
      query: {
        enabled: !!datasets.length,
        keepPreviousData: !!datasets && !!datasets.length,
      },
    },
  };

  const { data: datasetsData } = useGetDatasets(
    {
      ...getDatasetParams.params,
      fields: ["id", "name", "unit", "value_type"],
    },
    getDatasetParams.options,
  );

  const { data: datasetValueData } = useGetDatasetValues(
    {
      ...getDatasetParams.params,
      filters: {
        dataset: { id: { $in: datasets } },
        country: { iso3: { $in: [country, ...countriesComparison] } },
      },
      populate: "dataset,country,resources",
    },
    getDatasetParams.options,
  );

  const countries = country
    ? [country, ...countriesComparison].sort((a, b) => {
      if (!a || !b) return 0;
      return a.localeCompare(b);
    })
    : [];

  type TableColumnData = { name: string; iso3: string };

  const TABLE_COLUMNS_DATA = countries.reduce<TableColumnData[]>((acc, curr) => {
    const C = countriesData?.data?.find((c1) => c1.attributes?.iso3 === curr);
    if (!C || !C.attributes?.name) return acc;

    return [...acc, { name: C.attributes?.name, iso3: curr }];
  }, []);

  const TABLE_ROWS_DATA = datasetsData?.data?.reduce<TableRowsDataItem[]>(
    (prev, { attributes, id }) => {
      if (!!id && datasets.includes(id)) {
        return [
          ...prev,
          {
            id,
            unit: attributes?.unit,
            name: attributes?.name,
            values: countries.map((c) => {
              const datasetValue = datasetValueData?.data?.find(
                (v) =>
                  v?.attributes?.dataset?.data?.id === id &&
                  v?.attributes?.country?.data?.attributes?.iso3 === c,
              );
              // If is resource dataset get the resources
              const isResource = attributes?.value_type === "resource";
              const resources = isResource
                ? datasetValue?.attributes?.resources?.data?.reduce(
                  (acc: DatasetValueResourcesDataItemAttributes[], r) =>
                    r.attributes ? [...acc, r.attributes] : acc,
                  [],
                )
                : undefined;

              // If is not a resource dataset get the value
              const valueType = attributes?.value_type && `value_${attributes?.value_type}`;
              const value =
                !isResource &&
                isDatasetValueProperty(valueType) &&
                datasetValue?.attributes?.[valueType];
              const country = countriesData?.data?.find((c1) => c1.attributes?.iso3 === c);
              return {
                iso3: c,
                countryLink: country?.attributes?.link,
                countryName: country?.attributes?.name,
                isResource,
                resources,
                value,
              };
            }),
          },
        ];
      }
      return prev;
    },
    [],
  );

  return { TABLE_COLUMNS_DATA, TABLE_ROWS_DATA };
};

export default useTableData;
