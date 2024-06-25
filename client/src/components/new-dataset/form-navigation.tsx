"use client";

import { useCallback } from "react";

import isEmpty from "lodash-es/isEmpty";
import { SlPencil } from "react-icons/sl";

import { cn } from "@/lib/classnames";
import { getKeys } from "@/lib/utils/objects";

import { useSyncDatasetStep } from "@/app/store";

import { Data } from "@/containers/datasets/new";

import { Separator } from "@/components/ui/separator";

// type Steps = "settings" | "data" | "colors";

const STEPS = [
  {
    step: 1,
    value: "settings",
    title: "Settings",
  },
  {
    step: 2,
    value: "data",
    title: "Data",
  },
  {
    step: 3,
    value: "colors",
    title: "Colors",
  },
] as const;

const getValidData = (data: Data["settings"] | Data["data"]): boolean => {
  if (!data || isEmpty(data)) return false;

  return getKeys(data).every((key) => {
    if (typeof data[`${key}`] === "number") {
      return true;
    }
    return !isEmpty(data[`${key}`]);
  });
};

const Navigation = ({ data }: { data: Data; id: string }): JSX.Element => {
  const [, setStep] = useSyncDatasetStep();

  const handleStep = useCallback((step: number) => setStep(step), [setStep]);

  return (
    <nav className="relative z-20 flex w-full shrink-0">
      <ul className="flex w-full justify-between space-x-2 text-xs">
        {STEPS.map(({ step, title, value }, i) => {
          const prevScreen = STEPS[i - 1]?.value;
          const disabled = prevScreen && !getValidData(data?.[`${prevScreen}`]);

          return (
            <li
              key={step}
              className={cn(
                "flex w-full items-center space-x-2 text-center last:max-w-fit",
                disabled && "opacity-50",
              )}
            >
              <button
                onClick={() => handleStep(step)}
                disabled={!!disabled}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white"
              >
                {!isEmpty(data?.[value]) ? <SlPencil /> : step}
              </button>

              <span>{title}</span>

              {i !== STEPS.length - 1 && (
                <div className="w-full">
                  <Separator className="bg-gray-300/20" />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Navigation;
