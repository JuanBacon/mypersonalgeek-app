"use client";

import { useEffect } from "react";

export function RegisterServiceWorker() {
    useEffect(() => {
        // Only in production. In development a service worker would cache files and
        // make live reload behave strangely.
        if (process.env.NODE_ENV !== "production") return;
        if (!("serviceWorker" in navigator)) return;

        navigator.serviceWorker
            .register("/sw.js", { scope: "/" })
            .catch((error) => console.error("Service worker registration failed", error));
    }, []);

    return null;
}