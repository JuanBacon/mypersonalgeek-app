import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        id: "/",
        name: "MyPersonalGeek",
        short_name: "MyGeek",
        description: "Personal IT support tickets.",
        start_url: "/tickets",
        scope: "/",
        display: "standalone",
        background_color: "#f9f6f0",
        theme_color: "#f9f6f0",
        categories: ["utilities", "productivity"],
        icons: [
            { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
            { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
            { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
        shortcuts: [
            {
                name: "New ticket",
                short_name: "New",
                url: "/tickets/new",
                icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
            },
        ],
    };
}