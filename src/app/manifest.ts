import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/formday-pwa",
    name: "Formday - Fitness Tracker",
    short_name: "Formday",
    description:
      "Track your workouts and meals with Formday. Progress, not perfection. Works completely offline.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    display_override: ["standalone", "minimal-ui"],
    background_color: "#0f172a",
    theme_color: "#0f172a",
    orientation: "portrait",
    dir: "ltr",
    lang: "en",
    prefer_related_applications: false,
    categories: ["fitness", "health", "lifestyle", "productivity"],
    icons: [
      {
        src: "/icons/192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/192-maskable.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Today's Plan",
        short_name: "Today",
        description: "View today's workout and meal plan",
        url: "/",
        icons: [{ src: "/icons/192.png", sizes: "192x192" }],
      },
      {
        name: "Calendar",
        short_name: "Calendar",
        description: "View your fitness calendar",
        url: "/calendar",
        icons: [{ src: "/icons/192.png", sizes: "192x192" }],
      },
      {
        name: "Workouts",
        short_name: "Workouts",
        description: "Manage your workout plans",
        url: "/workout",
        icons: [{ src: "/icons/192.png", sizes: "192x192" }],
      },
      {
        name: "Meals",
        short_name: "Meals",
        description: "Manage your meal plans",
        url: "/meals",
        icons: [{ src: "/icons/192.png", sizes: "192x192" }],
      },
    ],
  };
}
