// /middleware.ts
import { NextFetchEvent, NextResponse } from "next/server";

import { NextRequestWithAuth, withAuth } from "next-auth/middleware";

const privatePaths = ["dashboard", "datasets"];

const dataMiddleware = async (request: Request) => {
  // Store current request url in a custom header, which you can read later
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-url", request.url);

  return NextResponse.next({
    request: {
      // Apply new request headers
      headers: requestHeaders,
    },
  });
};

const authMiddleware = withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
});

export default function middleware(req: NextRequestWithAuth, ev: NextFetchEvent) {
  const pathsPattern = privatePaths.join("|").replace(/\//g, "\\/");
  const privatePathnameRegex = RegExp(`^${pathsPattern}(?:\\/.*)?$`);
  const isPrivatePage = privatePathnameRegex.test(req.nextUrl.pathname);

  if (isPrivatePage) {
    console.log("isPrivatePage", isPrivatePage);
    return authMiddleware(req, ev);
  }

  return dataMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
