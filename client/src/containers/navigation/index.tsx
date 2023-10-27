"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { LuList, LuMap } from "react-icons/lu";

import { cn } from "@/lib/classnames";

const Navigation = (): JSX.Element => {
  const pathname = usePathname();

  return (
    <nav className="relative z-20 block h-full w-20 shrink-0 border-r-2 border-gray-300/20 bg-white">
      <ul className="w-full text-xs">
        <li className="py-5 text-center">
          <Link className="flex flex-col items-center justify-center gap-1" href="/">
            <Image priority alt="CCSA Logo" width={72} height={59} src="/logo.svg" />
          </Link>
        </li>
        <li className="py-5 text-center">
          <Link
            className={cn({
              "flex flex-col items-center justify-center gap-1": true,
              "text-primary": pathname === "/",
            })}
            href="/"
          >
            <LuMap className="h-6 w-6" />
            Explore datasets
          </Link>
        </li>
        <li className="py-5 text-center">
          <Link
            className={cn({
              "flex flex-col items-center justify-center gap-1": true,
              "text-primary": pathname === "/projects",
            })}
            href="/projects"
          >
            <LuList className="h-6 w-6" />
            Projects
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
