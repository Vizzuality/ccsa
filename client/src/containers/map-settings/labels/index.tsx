"use client";

import { useCallback } from "react";

import { useSyncMapSettings } from "@/app/url-query-params";

import { LABELS } from "@/constants/map";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const Labels = () => {
  const [{ labels }, setMapSettings] = useSyncMapSettings();

  const handleChange = useCallback(
    (v: (typeof LABELS)[0]["slug"]) => {
      setMapSettings((prev) => ({
        ...prev,
        labels: v,
      }));
    },
    [setMapSettings],
  );

  return (
    <RadioGroup value={labels} onValueChange={handleChange} className="gap-3">
      {LABELS.map((l) => (
        <div key={l.slug} className="group flex cursor-pointer items-center space-x-2">
          <RadioGroupItem value={l.slug} id={l.slug} />
          <Label
            className="cursor-pointer font-light transition-colors group-hover:text-slate-400"
            htmlFor={l.slug}
          >
            {l.label}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
};

export default Labels;
