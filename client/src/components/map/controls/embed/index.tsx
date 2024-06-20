"use client";

import { FC, HTMLAttributes, PropsWithChildren } from "react";

import { PopoverArrow } from "@radix-ui/react-popover";
import { TooltipPortal } from "@radix-ui/react-tooltip";
import { LuCode } from "react-icons/lu";

import { cn } from "@/lib/classnames";

import EmbedContent from "@/components/map/controls/embed/content";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipArrow, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { CONTROL_BUTTON_STYLES } from "../constants";

interface EmbedControlProps {
  className?: HTMLAttributes<HTMLDivElement>["className"];
}

export const EmbedControl: FC<PropsWithChildren<EmbedControlProps>> = ({
  className,
}: PropsWithChildren<EmbedControlProps>) => {
  return (
    <div className={cn("flex flex-col space-y-0.5", className)}>
      <Popover>
        <Tooltip>
          <PopoverTrigger asChild>
            <TooltipTrigger asChild>
              <button
                className={cn({
                  [CONTROL_BUTTON_STYLES.default]: true,
                  [CONTROL_BUTTON_STYLES.hover]: true,
                  [CONTROL_BUTTON_STYLES.active]: true,
                })}
                aria-label="Map Embed"
                type="button"
              >
                <LuCode className="h-full w-full" />
              </button>
            </TooltipTrigger>
          </PopoverTrigger>

          <TooltipPortal>
            <TooltipContent side="left" align="center">
              <div className="text-xxs">Map Embed</div>

              <TooltipArrow className="fill-white" width={10} height={5} />
            </TooltipContent>
          </TooltipPortal>

          <PopoverContent side="left" align="start">
            <EmbedContent />
            <PopoverArrow className="fill-white" width={10} height={5} />
          </PopoverContent>
        </Tooltip>
      </Popover>
    </div>
  );
};

export default EmbedControl;
