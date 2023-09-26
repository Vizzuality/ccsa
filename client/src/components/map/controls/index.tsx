"use client";

import { Children, FC, HTMLAttributes, PropsWithChildren } from "react";

import { cn } from "@/lib/classnames";

type ControlsProps = PropsWithChildren<{
  className?: HTMLAttributes<HTMLDivElement>["className"];
}>;

export const Controls: FC<ControlsProps> = ({
  className = "absolute bottom-10 left-2",
  children,
}: ControlsProps) => (
  <div
    className={cn({
      "flex flex-col space-y-2": true,
      [className]: !!className,
    })}
  >
    {Children.map(children, (child) => child)}
  </div>
);

export default Controls;
