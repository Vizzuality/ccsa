import { Open_Sans } from "next/font/google";
import localFont from "next/font/local";

export const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  fallback: ["system-ui", "Helvetica Neue", "Helvetica", "Arial"],
  weight: ["300", "400", "600", "800"],
  style: ["italic", "normal"],
  display: "block",
});

export const metropolis = localFont({
  src: [
    {
      path: "./Metropolis-Black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  display: "block",
  variable: "--font-metropolis",
});
