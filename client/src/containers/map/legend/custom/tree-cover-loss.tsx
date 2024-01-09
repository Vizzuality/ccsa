import { useMemo } from "react";

import { ParamsConfig } from "@/types/layers";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export interface LegendTreeCoverLossProps {
  description: string;
  startYear: number;
  endYear: number;
  paramsConfig: ParamsConfig;
  onChangeSettings: (settings: Record<string, unknown>) => unknown;
}

const LegendTreeCoverLoss: React.FC<LegendTreeCoverLossProps> = ({
  description,
  startYear: startYearValue,
  endYear: endYearValue,
  paramsConfig,
  onChangeSettings,
}) => {
  const startYear = useMemo(
    () => paramsConfig.find(({ key }) => key === "startYear")?.default as number,
    [paramsConfig],
  );

  const endYear = useMemo(
    () => paramsConfig.find(({ key }) => key === "endYear")?.default as number,
    [paramsConfig],
  );

  const options = useMemo(
    () =>
      startYear && endYear
        ? Array.from({
            length: endYear - startYear + 1,
          }).map((_, index) => ({
            label: startYear + index,
            value: startYear + index,
          }))
        : [],
    [startYear, endYear],
  );

  return (
    <div className="space-y-2.5">
      <p>{description}</p>

      <div className="flex items-center gap-x-2">
        <label htmlFor="tree-cover-loss-from">From</label>
        <Select
          value={`${startYearValue}`}
          onValueChange={(value) => onChangeSettings({ startYear: +value })}
        >
          <SelectTrigger id="tree-cover-loss-from" className="h-6 w-auto">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map(({ label, value }) => (
              <SelectItem
                key={value}
                value={`${value}`}
                disabled={value > endYearValue}
                className="w-full"
              >
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <label htmlFor="tree-cover-loss-to">to</label>
        <Select
          value={`${endYearValue}`}
          onValueChange={(value) => onChangeSettings({ endYear: +value })}
        >
          <SelectTrigger id="tree-cover-loss-to" className="h-6 w-auto">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map(({ label, value }) => (
              <SelectItem
                key={value}
                value={`${value}`}
                disabled={value < startYearValue}
                className="w-full"
              >
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default LegendTreeCoverLoss;
