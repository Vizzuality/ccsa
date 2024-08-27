import CSVImport from "./csv-import";

import { usePathname } from "next/navigation";

import { Dataset } from "@/types/generated/strapi.schemas";
import { useAtom } from "jotai";
import { datasetValuesNewAtom, datasetValuesAtom } from "@/app/store";

export default function Step2() {
  const [formValuesNew] = useAtom(datasetValuesNewAtom);
  const [formValuesEdit] = useAtom(datasetValuesAtom);
  const path = usePathname();

  const values = path.includes("new") ? formValuesNew : formValuesEdit;
  const valueType = values.settings.value_type as Dataset["value_type"];

  return <CSVImport valueType={valueType} values={values} />;
}
