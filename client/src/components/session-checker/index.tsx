'use client';

import {PropsWithChildren, useEffect} from "react";
import {signOut, useSession} from "next-auth/react";

import { privatePaths } from "@/middleware";
import {usePathname} from "next/navigation";

export default function SessionChecker ({children}: PropsWithChildren) {
    const { data: sessionData } = useSession();
    const pathname = usePathname()

    console.log(sessionData?.error)
    useEffect(() => {
        if (!!sessionData?.error) {
            // Sign out here
            signOut({
                // todo: add the callbackUrl
                ...privatePaths.includes(pathname) && { callbackUrl: "/signin" },
            });
        }
    }, [sessionData]);

    return (
        <>{children}</>
    )
}
