import { useGetCountries } from "@/types/generated/country";
import { useGetDatasets } from "@/types/generated/dataset";
import { useGetDatasetValues } from "@/types/generated/dataset-value";
import { DatasetValueResourcesDataItemAttributes } from "@/types/generated/strapi.schemas";

import { useSyncCountry, useSyncCountriesComparison, useSyncDatasets } from "@/app/store";

type TableRowsDataItem = {
  id: number;
  unit?: string;
  name?: string;
  values: {
    iso3: string;
    isResource: boolean;
    resources?: DatasetValueResourcesDataItemAttributes[];
    value: string | number | boolean | undefined;
  }[];
};

const dataValueType = ["value_boolean", "value_number", "value_text"] as const;

type DataValueType = (typeof dataValueType)[number];

const isDatasetValueProperty = (v?: string): v is DataValueType => {
  return !!v && dataValueType.includes(v as DataValueType);
};

const useTableData = () => {
  const [country] = useSyncCountry();
  const [countriesComparison] = useSyncCountriesComparison();
  const [datasets] = useSyncDatasets();

  const { data: countriesData } = useGetCountries({
    "pagination[pageSize]": 100,
    sort: "name:asc",
  });

  const { data: datasetsData } = useGetDatasets(
    { fields: ["id", "name", "unit", "value_type"] },
    {
      query: {
        enabled: !!datasets?.length && !!country,
        keepPreviousData: !!datasets?.length,
      },
    },
  );

  const { data: datasetValueData } = useGetDatasetValues(
    {
      filters: {
        dataset: { id: { $in: datasets } },
        country: { iso3: { $in: [country, ...countriesComparison] } },
      },
      populate: "dataset,country,resources",
    },
    {
      query: {
        enabled: !!datasets.length,
        keepPreviousData: !!datasets && !!datasets.length,
      },
    },
  );

  const countries = country
    ? [country, ...countriesComparison].sort((a, b) => {
        if (!a || !b) return 0;
        return a.localeCompare(b);
      })
    : [];

  const TABLE_COLUMNS_DATA = countries.map((c) => {
    const C = countriesData?.data?.find((c1) => c1.attributes?.iso3 === c);

    return C?.attributes?.name;
  });

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
              return {
                iso3: c,
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
