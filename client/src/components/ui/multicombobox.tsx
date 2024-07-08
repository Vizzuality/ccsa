"use client";

import * as React from "react";

import { LuCheck, LuChevronsUpDown } from "react-icons/lu";

import { cn } from "@/lib/classnames";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface MultiComboboxProps {
  values?: (string | number)[];
  options?: { value: string | number; label: string }[];
  placeholder?: string;
  onChange: (value: (string | number)[]) => void;
}

export function MultiCombobox({
  values = [],
  options = [],
  placeholder,
  onChange,
}: MultiComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const SELECTED = React.useMemo(() => {
    if (!values || !values.length) return placeholder || "Select...";

    if (values.length === 1) {
      const selectedOption = options?.find(
        (c) => c?.value.toString().toLowerCase() === values[0].toString().toLowerCase(),
      );
      return selectedOption?.label;
    }

    return `${values.length} selected`;
  }, [values, options, placeholder]);

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
                onChange([]);
              }}
            >
              Clear
            </CommandItem>
          </CommandGroup>
          <CommandGroup className="flex max-h-[30vh] flex-col overflow-auto border-t">
            {options.map((o) => (
              <CommandItem
                key={o.value}
                value={o.label}
                onSelect={() => {
                  if (values.includes(o.value)) {
                    onChange(values.filter((c) => c !== o.value));
                  } else {
                    onChange([...values, o.value]);
                  }
                }}
              >
                {o.label}

                <LuCheck
                  className={cn(
                    "ml-auto h-4 w-4",
                    values.includes(o.value) ? "opacity-100" : "opacity-0",
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
