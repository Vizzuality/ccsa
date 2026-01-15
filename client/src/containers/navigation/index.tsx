"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { LuCircleUser } from "react-icons/lu";
import { cn } from "@/lib/classnames";

import { Button, buttonVariants } from "@/components/ui/button";

import { useSyncSearchParams } from "@/app/store";

import CollaboratorsSvg from "@/svgs/collaborators.svg";
import ExploreSVG from "@/svgs/explore.svg";
import OtherToolsSvg from "@/svgs/other-tools.svg";
import ProjectsSVG from "@/svgs/projects.svg";
import { useSession } from "next-auth/react";

const Navigation = (): JSX.Element => {
  const pathname = usePathname();

  const sp = useSyncSearchParams();
  const { data: session } = useSession();

  const userNameWithoutSpaces = !session?.user?.username?.includes(" ");

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
              "flex flex-col items-center justify-center space-y-2 py-5 transition-colors hover:bg-gray-100/50":
                true,
              "bg-brand1/10 hover:bg-brand1/20": pathname === "/",
              "text-gray-400 group-hover:text-gray-900": pathname !== "/",
            })}
            href={`/?${decodeURIComponent(sp.toString())}`}
          >
            <ExploreSVG
              className={cn({
                "h-6 w-6 fill-none stroke-[1.5px]": true,
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
              "flex flex-col items-center justify-center space-y-2 py-5 transition-colors hover:bg-gray-100/50":
                true,
              "bg-brand2/10 hover:bg-brand2/20": pathname === "/projects",
              "text-gray-400 group-hover:text-gray-900": pathname !== "/projects",
            })}
            href={`/projects?${decodeURIComponent(sp.toString())}`}
          >
            <ProjectsSVG
              className={cn({
                "h-6 w-6 fill-none stroke-[1.5px]": true,
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
              "flex flex-col items-center justify-center space-y-2 py-5 transition-colors hover:bg-gray-100/50":
                true,
              "bg-[#E44491]/10 hover:bg-[#E44491]/20": pathname === "/other-tools",
              "text-gray-400 group-hover:text-gray-900": pathname !== "/other-tools",
            })}
            href="/other-tools"
          >
            <OtherToolsSvg
              className={cn({
                "h-6 w-6 fill-none stroke-[1.5px]": true,
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
              "flex flex-col items-center justify-center space-y-2 py-5 transition-colors hover:bg-gray-100/50":
                true,
              "bg-[#FF7816]/10 hover:bg-[#FF7816]/20": pathname === "/collaborators",
              "text-gray-400 group-hover:text-gray-900": pathname !== "/collaborators",
            })}
            href="/collaborators"
          >
            <CollaboratorsSvg
              className={cn({
                "h-6 w-6 fill-none stroke-[1.5px]": true,
                "stroke-gray-400 group-hover:stroke-gray-900": pathname !== "/collaborators",
                "stroke-[#FF7816]": pathname === "/collaborators",
              })}
            />
            <span>Collaborators</span>
          </Link>
        </li>
      </ul>
      <div className="border-t-2 border-gray-300/20 pt-3.5 ">
        <div className="group relative text-center">
          <Link
            href={!session ? "/signin" : "/dashboard"}
            className="flex flex-col items-center justify-center space-y-2 py-5 text-gray-400 transition-colors hover:bg-gray-100/50"
          >
            <LuCircleUser
              title="Log in"
              className="mx-auto h-6 w-6 rounded-full stroke-[1.5px] group-hover:border-gray-900 group-hover:stroke-gray-900"
            />
            <span
              className={cn({
                "w-full flex-wrap text-xxs": true,
                "overflow-hidden truncate px-2": userNameWithoutSpaces,
              })}
            >
              {session ? session.user.username : "Log in"}
            </span>
          </Link>
        </div>

        <div className="group relative py-5 text-center">
          <Link
            href="https://www.globalgiving.org/projects/building-a-climate-smart-zone-together/"
            className={cn(
              buttonVariants({
                size: "sm",
                className:
                  "rounded-3xl bg-[linear-gradient(0deg,rgba(0,0,0,0.20)_0%,rgba(0,0,0,0.20)_100%),linear-gradient(90deg,#E10098_0%,#F9423A_50.48%,#FFD700_100%)] text-xs font-bold text-white transition-[background] duration-200 ease-linear hover:bg-[linear-gradient(0deg,rgba(0,0,0,0.10)_0%,rgba(0,0,0,0.10)_100%),linear-gradient(90deg,#E10098_0%,#F9423A_50.48%,#FFD700_100%)]",
              }),
            )}
            target="blank"
            rel="noopener noreferrer"
          >
            Donate
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
