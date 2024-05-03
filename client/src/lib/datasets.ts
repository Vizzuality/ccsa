import { dataValueType } from "@/constants/datasets";

type DataValueType = (typeof dataValueType)[number];

export const isDatasetValueProperty = (v?: string): v is DataValueType => {
  return !!v && dataValueType.includes(v as DataValueType);
};
