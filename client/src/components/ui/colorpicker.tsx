import React from "react";

import { FC } from "react";

import { Input } from "./input";
import { LuCheck, LuChevronDown, LuChevronUp } from "react-icons/lu";

type ColorPickerProps = {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const ColorPicker: FC<ColorPickerProps> = ({ id, value, onChange }: ColorPickerProps) => {
  return (
    <div className="relative flex items-center justify-center">
      <Input
        id={id}
        type="color"
        value={value}
        onChange={onChange}
        className="absolute inset-0 top-2 h-full w-full cursor-pointer opacity-0"
      />
      <div className="flex h-full w-full items-center justify-between rounded-md border border-input bg-white p-2">
        <div className="flex items-center space-x-4">
          {value && (
            <span className="h-4 w-4 border border-input" style={{ backgroundColor: value }} />
          )}
          <span className="text-sm">{value || "Select one"}</span>
        </div>
        <LuChevronDown className="h-4 w-4" />
      </div>
    </div>
  );
};

export default ColorPicker;
