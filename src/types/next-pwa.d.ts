declare module "next-pwa" {
  import type { NextConfig } from "next";

  interface RuntimeCacheEntry {
    urlPattern: RegExp | string;
    handler:
      | "CacheFirst"
      | "CacheOnly"
      | "NetworkFirst"
      | "NetworkOnly"
      | "StaleWhileRevalidate";
    options?: {
      cacheName?: string;
      expiration?: {
        maxEntries?: number;
        maxAgeSeconds?: number;
        purgeOnQuotaError?: boolean;
      };
      networkTimeoutSeconds?: number;
      cacheableResponse?: {
        statuses?: number[];
        headers?: Record<string, string>;
      };
      matchOptions?: {
        ignoreSearch?: boolean;
        ignoreMethod?: boolean;
        ignoreVary?: boolean;
      };
    };
  }

  interface PWAConfig {
    dest?: string;
    disable?: boolean;
    register?: boolean;
    scope?: string;
    sw?: string;
    skipWaiting?: boolean;
    runtimeCaching?: RuntimeCacheEntry[];
    buildExcludes?: (string | RegExp)[];
    dynamicStartUrl?: boolean;
    dynamicStartUrlRedirect?: string;
    fallbacks?: {
      document?: string;
      image?: string;
      audio?: string;
      video?: string;
      font?: string;
    };
    cacheOnFrontEndNav?: boolean;
    reloadOnOnline?: boolean;
    customWorkerDir?: string;
    customWorkerSrc?: string;
    customWorkerDest?: string;
    customWorkerPrefix?: string;
    publicExcludes?: string[];
  }

  function withPWA(config: PWAConfig): (nextConfig: NextConfig) => NextConfig;

  export default withPWA;
}
