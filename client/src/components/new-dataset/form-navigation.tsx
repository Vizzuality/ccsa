"use client";

import { useCallback } from "react";

import { useAtom } from "jotai";
import { SlPencil } from "react-icons/sl";

import { datasetFormStepAtom } from "@/app/store";

import { Separator } from "@/components/ui/separator";

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

const Navigation = ({ enableNavigation }: { enableNavigation: boolean }): JSX.Element => {
  const [currentStep, setStep] = useAtom(datasetFormStepAtom);
  console.log(currentStep);
  const handleStep = useCallback((step: number) => setStep(step), []);
  return (
    <nav className="relative z-20 flex w-full shrink-0">
      <ul className="flex w-full justify-between space-x-2 text-xs">
        {STEPS.map(({ step, title }, i) => {
          const editionMode = step === currentStep;

          return (
            <li
              key={step}
              className="flex w-full items-center space-x-2 text-center last:max-w-fit"
            >
              <button
                type="button"
                onClick={() => handleStep(step)}
                // disabled={currentStep > step && !enableNavigation}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white"
              >
                {editionMode ? <SlPencil /> : step}
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
