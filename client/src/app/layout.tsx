import "@/styles/globals.css";
import "mapbox-gl/dist/mapbox-gl.css";
import "react-toastify/dist/ReactToastify.css";

import { PropsWithChildren } from "react";

import { ToastContainer } from "react-toastify";

import type { Metadata, Viewport } from "next";

import { GoogleAnalytics } from "@next/third-parties/google";
import { Hydrate, dehydrate } from "@tanstack/react-query";
import { getServerSession } from "next-auth";

import env from "@/env.mjs";

import getQueryClient from "@/lib/react-query/getQueryClient";

import { getGetUsersIdQueryOptions } from "@/types/generated/users-permissions-users-roles";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";

import PoweredBy from "@/containers/powered-by";

import { metropolis, openSans } from "@/styles/fonts";

import LayoutProviders from "./layout-providers";
import SessionChecker from "@/components/session-checker";

export const metadata: Metadata = {
  title: { template: "%s | CCSA", default: "CCSA" },
  description: "Caribbean Climate smart map",
};

export const viewport: Viewport = {
  width: 1000,
  initialScale: 1,
};

export default async function RootLayout({ children }: PropsWithChildren) {
  const session = await getServerSession(authOptions);

  const queryClient = getQueryClient();

  // Prefetch user
  if (session?.user?.id) {
    await queryClient.prefetchQuery(
      getGetUsersIdQueryOptions(`${session?.user?.id}`, { populate: "role" }),
    );
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <LayoutProviders session={session}>
      <Hydrate state={dehydratedState}>
        <html lang="en" className={`${openSans.variable} ${metropolis.variable}`}>
          <body>
          <SessionChecker />
            {children}

            <div className="fixed bottom-0 left-1/2 z-10 -translate-x-1/2">
              <PoweredBy />
            </div>
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={true}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </body>

          <GoogleAnalytics gaId={env.NEXT_PUBLIC_GA_TRACKING_ID} />
        </html>
      </Hydrate>
    </LayoutProviders>
  );
}
