import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import { getSelectorsByUserAgent } from "react-device-detect";

export const useMobile = () => {
  if (typeof navigator === "undefined") return false;
  const { isMobile } = getSelectorsByUserAgent(navigator.userAgent);
  return isMobile;
};
