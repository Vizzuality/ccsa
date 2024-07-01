"use client";

import { useCallback } from "react";

import { FieldValues, UseFormReturn } from "react-hook-form";

import { useAtom, useSetAtom } from "jotai";
import isEmpty from "lodash-es/isEmpty";
import { SlPencil } from "react-icons/sl";

import { cn } from "@/lib/classnames";
import { getKeys } from "@/lib/utils/objects";

import { datasetStepAtom, datasetValuesAtom } from "@/app/store";

import { Data } from "@/components/forms/dataset/types";
import { Separator } from "@/components/ui/separator";

type Steps = "settings" | "data" | "colors";
type StepsObject = {
  step: number;
  value: Steps;
  title: string;
};

const STEPS: StepsObject[] = [
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

const getErrorData = (data: Data["settings"] | Data["data"]): boolean => {
  if (!data || isEmpty(data)) return true;

  return getKeys(data).every((key) => {
    if (typeof data[`${key}`] === "number" || typeof data[`${key}`] === "boolean") {
      return false;
    }

    return isEmpty(data[`${key}`]);
  });
};

const Navigation = <T extends FieldValues>({
  data,
  form,
}: {
  id: string;
  data: Data;
  form: UseFormReturn<T>;
}): JSX.Element => {
  const [step, setStep] = useAtom(datasetStepAtom);
  const setFormValues = useSetAtom(datasetValuesAtom);

  const handleStep = useCallback(
    (s: number) => {
      form.trigger().then(() => {
        form.handleSubmit((values) => {
          setFormValues((prev) => ({
            ...prev,
            [`${STEPS[step - 1].value}`]: values,
          }));
          setStep(s);
        })();
      });
    },
    [form, step, setStep, setFormValues],
  );

  return (
    <nav className="relative z-20 flex w-full shrink-0">
      <ul className="flex w-full justify-between space-x-2 text-xs">
        {STEPS.map(({ step: s, title, value }, i) => {
          const prevScreen = STEPS[i - 1]?.value;
          const disabled = prevScreen && getErrorData(data?.[`${prevScreen}`]);

          return (
            <li
              key={s}
              className={cn(
                "flex w-full items-center space-x-2 text-center last:max-w-fit",
                disabled && "opacity-50",
              )}
            >
              <button
                disabled={!!disabled}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white"
                onClick={() => handleStep(s)}
              >
                {!isEmpty(data?.[value]) ? <SlPencil /> : s}
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
