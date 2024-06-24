"use client";

import { cn } from "@/lib/classnames";

import { Dataset } from "@/types/generated/strapi.schemas";

import { DATA_COLUMNS_TYPE } from "@/components/forms/new-dataset/constants";
import type { VALUE_TYPE } from "@/components/forms/new-dataset/types";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function DataContentToApprove({
  data,
  valueType,
  changes,
}: {
  data: {
    iso3: string;
    value: any; // TODO: Change to the correct type depending on value type
    color?: any;
  }[];

  valueType: VALUE_TYPE;
  changes: (keyof Dataset)[];
}) {
  const COLUMNS = DATA_COLUMNS_TYPE[valueType as VALUE_TYPE];
  return (
    <div className="flex items-center justify-between py-10 sm:px-10 md:px-24 lg:px-32">
      <div className="grid grid-cols-2 gap-10">
        <div className="flex w-full flex-1 flex-col justify-start">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="h-4 w-4 bg-green-400" />
              <span>New changes</span>
            </div>
            <p>
              {changes?.length > 0
                ? "Changes summary. Lorem ipsum dolor sit amet consectetur. Sit cursus sit pellentesque amet pellentesque tellus. Elit aliquam nec viverra egestas id ipsum vitae."
                : "No changes has been applied."}
            </p>
          </div>
        </div>

        <div className="w-full">
          <Table>
            <TableHeader>
              <TableRow>
                {COLUMNS.map(({ value, label }) => (
                  <TableHead key={value}>{label}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map(({ iso3, value }, rowIndex) => {
                return (
                  <TableRow key={rowIndex}>
                    <TableCell key={iso3}>{iso3}</TableCell>
                    <TableCell key={value}>{value}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
