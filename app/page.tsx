import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../lib/supabase/server";
import { logout } from "../app/login/actions";

export default async function HomePage() {
    const supabase = await createClient();

    const { data } = await supabase.auth.getClaims();
    const userId = data?.claims.sub;

    // The proxy already redirects logged-out visitors. This check is a second line
    // of defense in case the proxy is ever changed or misconfigured.
    if (!userId) {
        redirect("/login");
    }

    // "users" here is the public.users table (your profiles), not auth.users.
    const { data: profile } = await supabase
        .from("users")
        .select("display_name, user_role")
        .eq("id", userId)
        .single();

    return (
        <main className="mx-auto flex max-w-xl flex-col gap-6 p-6">
            <h1 className="text-2xl font-semibold">
                Hello, {profile?.display_name ?? "there"}
            </h1>

            <nav className="flex gap-4">
                <Link href="/tickets" className="underline">
                    Tickets
                </Link>
                <Link href="/tickets/new" className="underline">
                    New ticket
                </Link>
            </nav>

            <form action={logout}>
                <button type="submit" className="rounded border px-4 py-2">
                    Sign out
                </button>
            </form>
        </main>
    );
}