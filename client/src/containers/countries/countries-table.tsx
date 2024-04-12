import Flag from "react-world-flags";

import { LuExternalLink, LuX } from "react-icons/lu";

import { cn } from "@/lib/classnames";
import { formatNumber } from "@/lib/utils/formats";

import { useSyncCountry } from "@/app/store";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose,
  PopoverArrow,
  PopoverPortal,
} from "@/components/ui/popover";

import useTableData from "./utils";

const CountriesTable = () => {
  const { TABLE_COLUMNS_DATA, TABLE_ROWS_DATA } = useTableData();
  const [country] = useSyncCountry();

  const getValueComponent = (value: unknown) => {
    if (typeof value === "string") return <span>{value}</span>;
    if (typeof value === "number") {
      return formatNumber(value);
    }
    if (typeof value === "boolean") {
      return (
        <div
          className={cn(
            "inline-flex h-5 w-[51px] items-center justify-start gap-[7px] rounded-[49px] bg-opacity-20 py-2.5 pl-[5px] pr-2.5",
            value ? "bg-brand2/20" : "bg-gray-400/20",
          )}
        >
          <div
            className={cn(
              "h-[9px] w-[9px] rounded-full border border-white",
              value ? "bg-brand2" : "bg-gray-400",
            )}
          />
          <div
            className={cn(
              "text-center font-open-sans text-xs font-normal leading-[14.78px]",
              value ? "text-brand2" : "text-gray-400",
            )}
          >
            {value ? "Yes" : "No"}
          </div>
        </div>
      );
    }
    return "-";
  };

  return (
    <div className="w-full overflow-auto">
      {!!TABLE_ROWS_DATA && !!TABLE_ROWS_DATA.length && (
        <table>
          <thead>
            <tr>
              <th className="py-3 pr-3 text-left">
                <span className="font-open-sans text-xxs font-normal uppercase leading-none text-gray-400">
                  Datasets names
                </span>
              </th>
              {TABLE_COLUMNS_DATA?.map((c) => {
                return (
                  <th key={c.iso3} className="p-3 text-left">
                    <div className="flex items-center gap-2">
                      {!!country && (
                        <div className="h-[15px] w-5 overflow-hidden rounded">
                          <Flag code={c.iso3} className="h-[15px]" />
                        </div>
                      )}
                      <span className="whitespace-nowrap font-open-sans text-xxs font-semibold uppercase leading-none text-gray-900">
                        {c.name}
                      </span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {TABLE_ROWS_DATA?.map((t) => {
              return (
                <tr key={t?.id} className="border-t text-gray-700">
                  <td className="py-3 pr-3">
                    <span className="whitespace-nowrap text-xs font-semibold leading-none">
                      {t?.name} {!!t?.unit ? `(${t?.unit})` : ""}
                    </span>
                  </td>
                  {t?.values?.map((v) => {
                    return (
                      <td key={v.iso3} className="space-y-1.5 p-3">
                        {v.isResource ? (
                          v.resources?.length ? (
                            v.resources?.map((r) => (
                              <Popover key={r.link_title}>
                                <PopoverTrigger className="whitespace-nowrap rounded border border-brand1/20 bg-brand1/10 px-2.5 py-[3px] text-xs leading-none text-brand1 data-[state='open']:bg-brand1 data-[state='open']:text-white">
                                  {r.link_title}
                                </PopoverTrigger>
                                <PopoverPortal>
                                  <PopoverContent
                                    id={`popover-${t.name}`}
                                    className="w-fit min-w-[240px] max-w-[500px] space-y-3 border-none bg-gray-700 text-white"
                                  >
                                    <PopoverArrow className="fill-gray-700" />

                                    <div className="flex items-center justify-between font-open-sans">
                                      <p className="text-xxs font-semibold uppercase leading-none text-gray-400">
                                        {t.name}
                                      </p>
                                      <PopoverClose>
                                        <LuX className="h-6 w-6 text-white" />
                                      </PopoverClose>
                                    </div>
                                    <p className="border-b border-white/20 pb-3 text-xl">
                                      {r.link_title}
                                    </p>
                                    <p className="text-xs">{r.description}</p>
                                    <a
                                      href={r.link_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-2 py-1.5 text-xs text-brand2"
                                    >
                                      Learn more <LuExternalLink className="h-5 w-5" />
                                    </a>
                                  </PopoverContent>
                                </PopoverPortal>
                              </Popover>
                            ))
                          ) : (
                            "-"
                          )
                        ) : (
                          <span className="whitespace-nowrap text-xs leading-none">
                            {getValueComponent(v.value)}
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
  );
};

export default CountriesTable;
