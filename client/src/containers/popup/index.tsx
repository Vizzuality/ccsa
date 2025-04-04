"use client";

import { PropsWithChildren, useMemo, useState } from "react";

import { LuChevronLeft } from "react-icons/lu";

import { cn } from "@/lib/classnames";

const Popup = ({
  visibleKey,
  children,
  className,
}: PropsWithChildren<{ visibleKey: string | number | null; className?: string }>): JSX.Element => {
  const [open, setOpen] = useState(false);

  const toggleOpen = () => setOpen((prev) => !prev);

  useMemo(() => {
    setOpen(!!visibleKey);
  }, [visibleKey]);

  return (
    <aside
      className={cn({
        "min-h-80 absolute left-full top-0 z-0 w-full max-w-md translate-x-[calc(-100%_-_theme(spacing.6))] rounded-br-3xl shadow transition-transform duration-300 ease-in-out":
          true,
        "-translate-x-full": !open && visibleKey,
        "translate-x-0": open && visibleKey,
        [className || ""]: !!className,
      })}
    >
      <div className="relative z-10 h-full max-h-screen w-full overflow-auto rounded-br-3xl bg-white">
        {children}
      </div>

      <button
        className="absolute left-full top-12 z-0 rounded-r-lg bg-white  py-2.5 shadow"
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

export default Popup;
