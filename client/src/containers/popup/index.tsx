"use client";

import { PropsWithChildren, useState } from "react";

import { LuChevronLeft } from "react-icons/lu";

import { cn } from "@/lib/classnames";

const Popup = ({ children }: PropsWithChildren): JSX.Element => {
  const [open, setOpen] = useState(true);

  const toggleOpen = () => setOpen((prev) => !prev);

  return (
    <aside
      className={cn({
        "absolute left-full top-0 z-0 h-80 w-full max-w-md rounded-br-3xl bg-gray-800 text-white transition-transform duration-300 ease-in-out":
          true,
        "-translate-x-full": !open,
      })}
    >
      <div className="relative z-10 h-full w-full p-5 pl-10">{children}</div>

      <button
        className="absolute left-full top-12 z-10 rounded-r-lg bg-gray-800 py-2.5"
        onClick={toggleOpen}
      >
        <LuChevronLeft
          className={cn({
            "h-5 w-5 text-white transition-transform delay-200 duration-300 ease-in-out": true,
            "rotate-180": !open,
          })}
        />
      </button>
    </aside>
  );
};

export default Popup;
