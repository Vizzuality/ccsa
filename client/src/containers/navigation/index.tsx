"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useSession } from "next-auth/react";
import { LuUser2 } from "react-icons/lu";

import { cn } from "@/lib/classnames";

import { useSyncSearchParams } from "@/app/store";

import CollaboratorsSvg from "@/svgs/collaborators.svg";
import ExploreSVG from "@/svgs/explore.svg";
import OtherToolsSvg from "@/svgs/other-tools.svg";
import ProjectsSVG from "@/svgs/projects.svg";

const Navigation = (): JSX.Element => {
  const pathname = usePathname();

  const sp = useSyncSearchParams();

  const { data: session } = useSession();

  return (
    <nav className="relative z-20 flex h-full w-20 shrink-0 flex-col justify-between border-r-2 border-gray-300/20 bg-white">
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

        <li className="group relative text-center">
          <div
            className={cn({
              "absolute left-0 top-0 h-full w-1 -translate-x-full bg-[#E44491] transition-transform":
                true,
              "translate-x-0": pathname === "/other-tools",
            })}
          />
          <Link
            className={cn({
              "flex flex-col items-center justify-center space-y-2 py-5 transition-colors": true,
              "bg-[#E44491]/10": pathname === "/other-tools",
              "text-gray-400 group-hover:text-gray-900": pathname !== "/other-tools",
            })}
            href="/other-tools"
          >
            <OtherToolsSvg
              className={cn({
                "h-6 w-6 fill-none ": true,
                "stroke-gray-400 group-hover:stroke-gray-900": pathname !== "/other-tools",
                "stroke-[#E44491]": pathname === "/other-tools",
              })}
            />
            <span>Other Tools</span>
          </Link>
        </li>

        <li className="group relative text-center">
          <div
            className={cn({
              "absolute left-0 top-0 h-full w-1 -translate-x-full bg-[#FF7816] transition-transform":
                true,
              "translate-x-0": pathname === "/collaborators",
            })}
          />
          <Link
            className={cn({
              "flex flex-col items-center justify-center space-y-2 py-5 transition-colors": true,
              "bg-[#FF7816]/10": pathname === "/collaborators",
              "text-gray-400 group-hover:text-gray-900": pathname !== "/collaborators",
            })}
            href="/collaborators"
          >
            <CollaboratorsSvg
              className={cn({
                "h-6 w-6 fill-none ": true,
                "stroke-gray-400 group-hover:stroke-gray-900": pathname !== "/collaborators",
                "stroke-[#FF7816]": pathname === "/collaborators",
              })}
            />
            <span>Collaborators</span>
          </Link>
        </li>
      </ul>
      <div className="group relative py-5 text-center">
        <div
          className={cn({
            "absolute left-0 top-0 h-full w-1 -translate-x-full bg-[#FF7816] transition-transform":
              true,
            "translate-x-0": pathname === "/collaborators",
          })}
        />
        <Link
          href={!session ? "/signin" : "/profile"}
          className={cn({
            "flex flex-col items-center justify-center space-y-2 py-5 transition-colors": true,
            "bg-[#FF7816]/10": pathname === "/collaborators",
            "text-gray-400 group-hover:text-gray-900": pathname !== "/collaborators",
          })}
        >
          <LuUser2
            title="Log in"
            className={cn({
              "mx-auto h-6 w-6 rounded-full border-2 border-gray-400 fill-none group-hover:border-gray-900":
                true,
              "stroke-gray-400 group-hover:stroke-gray-900": pathname !== "/collaborators",
              "stroke-[#FF7816]": pathname === "/collaborators",
            })}
          />
          <span className="text-xxs">{session ? session.user?.username : "Log in"}</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;
