"use client";

import Link from "next/link";

import { cn } from "@/lib/classnames";

const Navigation = (): JSX.Element => {
  return (
    <nav className="relative z-20 flex w-full shrink-0 ">
      <ul className="flex w-full justify-between text-xxs">
        <li className="py-5 text-center">
          <Link
            className="flex flex-col items-center justify-center gap-1"
            href="/new-dataset/settings"
          >
            1
          </Link>
        </li>
        <li className="py-5 text-center">
          <Link
            className="flex flex-col items-center justify-center gap-1"
            href="/new-dataset/data"
          >
            2
          </Link>
        </li>
        <li className="py-5 text-center">
          <Link
            className="flex flex-col items-center justify-center gap-1"
            href="/new-dataset/color"
          >
            3
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
