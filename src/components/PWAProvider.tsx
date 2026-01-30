"use client";

import { OfflineBanner } from "./OfflineBanner";
import { InstallPrompt } from "./InstallPrompt";

/**
 * Client-side PWA wrapper component
 * Includes offline banner and install prompt
 */
export function PWAProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <OfflineBanner />
      {children}
      <InstallPrompt />
    </>
  );
}
