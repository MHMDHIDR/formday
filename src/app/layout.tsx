import "~/styles/globals.css";

import { type Metadata, type Viewport } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { PWAProvider } from "~/components/PWAProvider";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0f172a" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export const metadata: Metadata = {
  title: "Formday - Fitness Tracker",
  description:
    "Track your workouts and meals with Formday. Progress, not perfection. Works completely offline.",
  applicationName: "Formday",
  authors: [{ name: "Formday Team" }],
  generator: "Next.js",
  keywords: ["fitness", "workout", "meal", "tracker", "pwa", "offline"],
  referrer: "origin-when-cross-origin",
  creator: "Formday",
  publisher: "Formday",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icons/192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/512.png", sizes: "512x512", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Formday",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <head>
        {/* Additional PWA meta tags for iOS compatibility */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="Formday" />
        <link rel="apple-touch-icon" href="/icons/192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icons/512.png" />
        {/* Prevent text size adjustment on orientation change */}
        <meta
          name="format-detection"
          content="telephone=no, date=no, email=no, address=no"
        />
      </head>
      <body>
        <TRPCReactProvider>
          <PWAProvider>{children}</PWAProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
