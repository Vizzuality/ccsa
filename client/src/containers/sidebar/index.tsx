"use client";

import { PropsWithChildren, useState } from "react";

import { LuChevronLeft } from "react-icons/lu";

import { cn } from "@/lib/classnames";

import Popup from "@/containers/popup";

const Sidebar = ({ children }: PropsWithChildren): JSX.Element => {
  const [open, setOpen] = useState(true);

  const toggleOpen = () => setOpen((prev) => !prev);

  return (
    <aside
      className={cn({
        "absolute left-20 top-0 z-10 h-full w-full max-w-md shadow transition-transform duration-300 ease-in-out":
          true,
        "-translate-x-full": !open,
      })}
    >
      <div className="relative z-10 h-full w-full bg-white">{children}</div>

      <button
        className="absolute left-full top-0 z-10 rounded-r-lg bg-white py-2.5"
        onClick={toggleOpen}
      >
        <LuChevronLeft
          className={cn({
            "h-5 w-5 transition-transform delay-200 duration-300 ease-in-out": true,
            "rotate-180": !open,
          })}
        />
      </button>

      <Popup>
        <div>
          <h3 className="text-xs uppercase">Analyze country</h3>
        </div>
      </Popup>
    </aside>
  );
};

export default Sidebar;
