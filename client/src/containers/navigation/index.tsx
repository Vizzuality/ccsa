"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/classnames";

import { useSyncSearchParams } from "@/app/store";

import ExploreSVG from "@/svgs/explore.svg";
import ProjectsSVG from "@/svgs/projects.svg";

const Navigation = (): JSX.Element => {
  const pathname = usePathname();

  const sp = useSyncSearchParams();

  return (
    <nav className="relative z-20 block h-full w-20 shrink-0 border-r-2 border-gray-300/20 bg-white">
      <ul className="w-full text-xxs">
        <li className="py-5 text-center">
          <Link className="flex flex-col items-center justify-center gap-1" href="/">
            <Image priority alt="CCSA Logo" width={72} height={59} src="/logo.svg" />
          </Link>
        </li>

        <li className="group relative text-center">
          <div
            className={cn({
              "absolute left-0 top-0 h-full w-1 -translate-x-full bg-brand1 transition-transform":
                true,
              "translate-x-0": pathname === "/",
            })}
          />
          <Link
            className={cn({
              "flex flex-col items-center justify-center space-y-2 py-5 transition-colors": true,
              "bg-brand1/10": pathname === "/",
              "text-gray-400 group-hover:text-gray-900": pathname !== "/",
            })}
            href={`/?${decodeURIComponent(sp.toString())}`}
          >
            <ExploreSVG
              className={cn({
                "h-6 w-6 fill-none ": true,
                "stroke-gray-400 group-hover:stroke-gray-900": pathname !== "/",
                "stroke-brand1": pathname === "/",
              })}
            />
            <span>Explore Datasets</span>
          </Link>
        </li>

        <li className="group relative text-center">
          <div
            className={cn({
              "absolute left-0 top-0 h-full w-1 -translate-x-full bg-brand2 transition-transform":
                true,
              "translate-x-0": pathname === "/projects",
            })}
          />
          <Link
            className={cn({
              "flex flex-col items-center justify-center space-y-2 py-5 transition-colors": true,
              "bg-brand2/10": pathname === "/projects",
              "text-gray-400 group-hover:text-gray-900": pathname !== "/projects",
            })}
            href={`/projects?${decodeURIComponent(sp.toString())}`}
          >
            <ProjectsSVG
              className={cn({
                "h-6 w-6 fill-none ": true,
                "stroke-gray-400 group-hover:stroke-gray-900": pathname !== "/projects",
                "stroke-brand2": pathname === "/projects",
              })}
            />
            <span>Projects</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
