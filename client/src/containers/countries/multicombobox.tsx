"use client";

import * as React from "react";

import { LuCheck, LuChevronsUpDown } from "react-icons/lu";

import { cn } from "@/lib/classnames";

import { useGetCountries } from "@/types/generated/country";

import { useSyncCountriesComparison, useSyncCountry } from "@/app/store";

import { GET_COUNTRIES_OPTIONS } from "@/constants/countries";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function MultiCombobox() {
  const [country] = useSyncCountry();
  const [comparisonCountries, setComparisonCountries] = useSyncCountriesComparison();
  const [open, setOpen] = React.useState(false);

  const { data: countriesData } = useGetCountries(GET_COUNTRIES_OPTIONS);

  const OPTIONS = React.useMemo(() => {
    return (
      countriesData?.data
        ?.filter((c) => c.attributes?.iso3 !== country)
        ?.map((c) => ({
          value: `${c.attributes?.iso3}`,
          label: `${c.attributes?.name}`,
        })) || []
    );
  }, [countriesData, country]);

  const SELECTED = React.useMemo(() => {
    if (!comparisonCountries || !comparisonCountries.length)
      return "Select a country to compare...";

    if (comparisonCountries.length === 1) {
      return OPTIONS?.find((c) => c?.value.toLowerCase() === comparisonCountries[0].toLowerCase())
        ?.label;
    }

    return `${comparisonCountries.length} countries selected`;
  }, [OPTIONS, comparisonCountries]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {SELECTED}
          <LuChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="popover-content-width-same-as-its-trigger p-0">
        <Command className="w-full">
          <CommandInput placeholder="Search country..." className="h-9" />
          <CommandEmpty>No country found.</CommandEmpty>
          <CommandGroup>
            <CommandItem
              key="clear"
              value="Clear"
              className="text-sm font-medium text-primary"
              onSelect={() => {
                setComparisonCountries([]);
              }}
            >
              Clear
            </CommandItem>
          </CommandGroup>
          <CommandGroup className="max-h-[30vh] overflow-auto border-t">
            {OPTIONS.map((o) => (
              <CommandItem
                key={o.value}
                value={o.label}
                onSelect={() => {
                  if (comparisonCountries.includes(o.value)) {
                    setComparisonCountries(comparisonCountries.filter((c) => c !== o.value));
                  } else {
                    setComparisonCountries([...comparisonCountries, o.value]);
                  }
                }}
              >
                {o.label}

                <LuCheck
                  className={cn(
                    "ml-auto h-4 w-4",
                    comparisonCountries.includes(o.value) ? "opacity-100" : "opacity-0",
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
