"use client";

import dynamic from "next/dynamic";

const WelcomeMessage = dynamic(() => import("@/containers/welcome-message"), { ssr: false });

const WelcomeMessageWrapper = () => <WelcomeMessage />;

export default WelcomeMessageWrapper;
