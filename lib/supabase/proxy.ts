import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { supabaseUrl, supabasePublishableKey } from "./env";

const PUBLIC_PATHS = ["/login"];

function isPublicPath(pathname: string) {
    return PUBLIC_PATHS.some(
        (path) => pathname === path || pathname.startsWith(`${path}/`),
    );
}

// Redirect while keeping any session cookies that were just refreshed.
function redirectTo(
    request: NextRequest,
    pathname: string,
    sessionResponse: NextResponse,
) {
    const url = request.nextUrl.clone();
    url.pathname = pathname;
    url.search = "";

    const redirect = NextResponse.redirect(url);
    sessionResponse.cookies
        .getAll()
        .forEach((cookie) => redirect.cookies.set(cookie));
    return redirect;
}

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({ request });

    const supabase = createServerClient(supabaseUrl, supabasePublishableKey, {
        cookies: {
            getAll() {
                return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value }) =>
                    request.cookies.set(name, value),
                );
                response = NextResponse.next({ request });
                cookiesToSet.forEach(({ name, value, options }) =>
                    response.cookies.set(name, value, options),
                );
            },
        },
    });

    // Do not run any code between createServerClient and getClaims().
    const { data } = await supabase.auth.getClaims();
    const isLoggedIn = Boolean(data?.claims);
    const { pathname } = request.nextUrl;

    if (!isLoggedIn && !isPublicPath(pathname)) {
        return redirectTo(request, "/login", response);
    }

    if (isLoggedIn && pathname === "/login") {
        return redirectTo(request, "/", response);
    }

    return response;
}