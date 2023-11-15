import * as React from "react";

import { LuSearch, LuX } from "react-icons/lu";

import { cn } from "@/lib/classnames";

export interface SearchProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Search = React.forwardRef<HTMLInputElement, SearchProps>(
  ({ type, value, defaultValue, onChange, ...props }, ref) => {
    const [v, setV] = React.useState(defaultValue || value || "");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setV(e.target.value);
      if (onChange) {
        onChange(e);
      }
    };

    const handleClear = () => {
      setV("");
      if (onChange) {
        onChange({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>);
      }
    };

    return (
      <div className="relative flex ">
        <LuSearch className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2" />
        <input
          type={type}
          className={cn({
            "flex w-full rounded-lg border border-input bg-gray-100 p-3 pl-8 text-sm ring-offset-background":
              true,
            "file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:border-primary focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50":
              true,
          })}
          ref={ref}
          value={v}
          onChange={handleChange}
          {...props}
        />

        {v && (
          <LuX
            className={cn({
              "absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 cursor-pointer rounded-full p-1 text-gray-400 hover:bg-gray-300":
                true,
            })}
            onClick={handleClear}
          />
        )}
      </div>
    );
  },
);
Search.displayName = "Search";

export { Search };
