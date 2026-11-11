import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
    return await updateSession(request);
}

export const config = {
    matcher: [
        // Everything except static files and the PWA files. The manifest, service
        // worker, offline page and icons must be reachable WITHOUT logging in,
        // otherwise the proxy redirects them to /login and the app can't be installed.
        "/((?!_next/static|_next/image|favicon.ico|sw.js|manifest.webmanifest|offline.html|icons/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};