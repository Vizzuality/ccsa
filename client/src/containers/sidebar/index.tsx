"use client";

import { PropsWithChildren, useState } from "react";

import { usePathname } from "next/navigation";

import { LuChevronLeft } from "react-icons/lu";

import { cn } from "@/lib/classnames";

import { fullSidebarPages } from "./constants";

const Sidebar = ({ children }: PropsWithChildren): JSX.Element => {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);

  const toggleOpen = () => setOpen((prev) => !prev);

  const isFullWidth = fullSidebarPages.some((page) => pathname.includes(page));

  return (
    <aside
      className={cn({
        "absolute left-20 top-0 z-10 h-full w-full shadow transition-transform duration-300 ease-in-out":
          true,
        "-translate-x-full": !open,
        "max-w-lg": !isFullWidth,
        "w-[90%]": isFullWidth,
      })}
    >
      {children}

      <button
        className="absolute left-full top-0 z-0 rounded-r-lg bg-white py-2.5 shadow"
        onClick={toggleOpen}
      >
        <LuChevronLeft
          className={cn({
            "h-5 w-5 transition-transform delay-200 duration-300 ease-in-out": true,
            "rotate-180": !open,
          })}
        />
      </button>
    </aside>
  );
};

export default Sidebar;
