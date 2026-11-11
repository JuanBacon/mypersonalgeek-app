import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { logout } from "@/app/login/actions";

export function AppHeader({ displayName }: { displayName: string }) {
    return (
        <header className="flex flex-wrap items-center justify-between gap-3">
            <a
                href="#main"
                className="sr-only focus:not-sr-only focus:rounded-xl focus:border-4 focus:border-ink focus:bg-white focus:px-3 focus:py-2"
            >
                Skip to content
            </a>

            <Link href="/tickets" className="flex items-center gap-2 font-display text-2xl sm:text-3xl">
                <span aria-hidden>👓</span>
                MYPERSONALGEEK
            </Link>

            <div className="flex items-center gap-3">
                <Badge tone="white" className="hidden sm:inline-flex">
                    {displayName}
                </Badge>
                <form action={logout}>
                    <Button type="submit" size="sm" tone="white">
                        Sign out
                    </Button>
                </form>
            </div>
        </header>
    );
}