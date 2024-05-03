"use client";
import { useState } from "react";

import { useAtomValue } from "jotai";
import { LuExternalLink, LuInfo } from "react-icons/lu";

import { cn } from "@/lib/classnames";

import { OtherTool } from "@/types/generated/strapi.schemas";

import { otherToolsSearchAtom } from "@/app/store";

import SearchHighlight from "@/components/ui/search-highlight";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
  TooltipProvider,
} from "@/components/ui/tooltip";

type ToolCardProps = {
  tool?: OtherTool;
};

const ToolCard = ({ tool }: ToolCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const search = useAtomValue(otherToolsSearchAtom);

  return (
    <div className="flex items-center space-x-5 rounded-lg border border-gray-200 p-5">
      <div className="w-full space-y-2">
        <div className="font-open-sans text-sm">
          <SearchHighlight query={search}>
            {tool?.other_tools_category?.data?.attributes?.name}
          </SearchHighlight>
        </div>
        <div className="flex w-full justify-between">
          <h2 className="font-metropolis text-lg font-[900] text-gray-800">
            <SearchHighlight query={search}>{tool?.name}</SearchHighlight>
          </h2>
          <div className="flex h-6 items-center gap-2 ">
            {!!tool?.description && (
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger disabled={!tool?.description}>
                    <LuInfo className="h-5 w-5" />
                  </TooltipTrigger>
                  <TooltipContent className="border-bg-gray-800 max-w-[256px] border bg-gray-800 p-2.5 text-sm text-white">
                    <div>{tool?.description}</div>
                    <TooltipArrow />
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <div
              className={cn(
                "flex items-center gap-1 overflow-hidden py-1 transition-all  duration-500",
                {
                  "w-24 rounded-md bg-zinc-200 bg-opacity-100 px-2": isHovered,
                  "w-6 bg-white bg-opacity-0": !isHovered,
                },
              )}
              onMouseLeave={() => setIsHovered(false)}
              onMouseEnter={() => setIsHovered(true)}
            >
              <div>
                <LuExternalLink className="h-5 w-5" />
              </div>
              <a
                href={tool?.link}
                className={cn(
                  "whitespace-nowrap font-open-sans text-xs font-semibold leading-tight duration-300",
                  {
                    "opacity-0": !isHovered,
                    "opacity-100": isHovered,
                  },
                )}
                target="_blank"
                rel="noreferrer noopener"
              >
                Visit tool
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolCard;
