"use client";

import { useSyncDatasetStep } from "@/app/store";

import Step1 from "./step1";
import Step2 from "./step2";
import Step3 from "./step3";

const STEPS: Record<number, () => JSX.Element> = {
  1: Step1,
  2: Step2,
  3: Step3,
};

export default function NewDatasetPagePage() {
  const [step] = useSyncDatasetStep();
  const Description = STEPS[step];

  return (
    <div className="text-xs font-light">
      <Description />
    </div>
  );
}
