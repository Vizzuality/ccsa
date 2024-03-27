"use client";

import { formatNumber } from "@/lib/utils/formats";

import { DatasetValueResourcesDataItemAttributes } from "@/types/generated/strapi.schemas";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import useTableData from "./utils";

const CountryDataDialog = () => {
  const { TABLE_COLUMNS_DATA, TABLE_ROWS_DATA } = useTableData();
  return (
    <div className="max-h-[90svh] overflow-auto p-10">
      <section className="space-y-2.5">
        <div className="w-full overflow-auto">
          {!!TABLE_ROWS_DATA && !!TABLE_ROWS_DATA.length && (
            <table>
              <thead>
                <tr>
                  <th className="py-3 pr-3 text-left">
                    <span className="text-sm leading-none"></span>
                  </th>
                  {TABLE_COLUMNS_DATA?.map((c) => {
                    return (
                      <th key={c} className="p-3 text-left">
                        <span className="whitespace-nowrap text-sm leading-none">{c}</span>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody>
                {TABLE_ROWS_DATA?.map((t) => {
                  return (
                    <tr key={t?.id} className="border-t">
                      <td className="py-3 pr-3">
                        <span className="whitespace-nowrap text-sm leading-none">
                          {t?.name} {!!t?.unit ? `(${t?.unit})` : ""}
                        </span>
                      </td>
                      {t?.values?.map((v) => {
                        return (
                          <td key={v.iso3} className="space-y-1.5 p-3">
                            {v.isResource ? (
                              (v.value as DatasetValueResourcesDataItemAttributes[])?.map((r) => (
                                <Popover key={r.link_title}>
                                  <PopoverTrigger className="whitespace-nowrap rounded border border-brand1 bg-brand1/20 px-2.5 data-[state='open']:bg-brand1">
                                    {r.link_title}
                                  </PopoverTrigger>
                                  <PopoverContent>
                                    <div className="space-y-2 p-3">
                                      <h4 className="text-sm font-bold">{r.link_title}</h4>
                                      <p className="text-sm">{r.description}</p>
                                      <p className="text-sm">{r.link_url}</p>
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              ))
                            ) : (
                              <span className="whitespace-nowrap text-sm leading-none">
                                {v.value ? formatNumber(v.value) : "-"}
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
};

export default CountryDataDialog;
