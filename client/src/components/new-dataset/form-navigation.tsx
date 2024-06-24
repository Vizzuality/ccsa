"use client";

import { useCallback } from "react";

import isEmpty from "lodash-es/isEmpty";

import { useAtom } from "jotai";
import { SlPencil } from "react-icons/sl";

import { datasetFormStepAtom } from "@/app/store";

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
];

const Navigation = ({
  data,
  // handleStep,
  form,
}: {
  data: any;
  form: any;
}): JSX.Element => {
  // const setStep = useSetAtom(datasetFormStepAtom);
  const [step, setStep] = useAtom(datasetFormStepAtom);

  const handleStep = useCallback((step: number) => setStep(step), []);

  return (
    <nav className="relative z-20 flex w-full shrink-0">
      <ul className="flex w-full justify-between space-x-2 text-xs">
        {STEPS.map(({ step, title, value }, i) => {
          const prevScreen = STEPS[i - 1]?.value;
          return (
            <li
              key={step}
              className="flex w-full items-center space-x-2 text-center last:max-w-fit"
            >
              <button
                type="button"
                onClick={() => handleStep(step)}
                disabled={!!(prevScreen && isEmpty(data?.[prevScreen]))}
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
