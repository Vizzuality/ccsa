import React from "react";
import { FC, useState } from "react";

import { LuChevronDown, LuChevronUp } from "react-icons/lu";

import { cn } from "@/lib/classnames";

import { Input } from "./input";

type ColorPickerProps = {
  id: string;
  value: string;
  className?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const ColorPicker: FC<ColorPickerProps> = ({
  id,
  value,
  className,
  onChange,
}: ColorPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative flex items-center justify-center">
      <Input
        id={id}
        type="color"
        value={value}
        onChange={onChange}
        onClick={() => setIsOpen(!isOpen)}
        className={cn("absolute inset-0 top-2 h-full w-full cursor-pointer opacity-0", className)}
      />
      <div
        className={cn({
          "flex h-full w-full items-center justify-between rounded-md border border-input bg-white p-2":
            true,
          [`${className}`]: className,
        })}
      >
        <div className="flex items-center space-x-4">
          {value && (
            <span className="h-4 w-4 border border-input" style={{ backgroundColor: value }} />
          )}
          <span className="text-sm">{value || "Select one"}</span>
        </div>
        {isOpen ? <LuChevronUp /> : <LuChevronDown className="h-4 w-4" />}
      </div>
    </div>
  );
};

export default ColorPicker;