"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

// Two panes. On desktop both are visible side by side. On mobile only one is:
// the list at /tickets, or the detail pane on any other /tickets/... route.
export function TicketsShell({
    list,
    children,
}: {
    list: React.ReactNode;
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const detailOpen = pathname !== "/tickets";

    return (
        <div className="grid gap-6 lg:grid-cols-[minmax(320px,420px)_1fr] lg:items-start">
            <section
                aria-label="Tickets"
                className={cn(
                    detailOpen ? "hidden lg:block" : "block",
                    "lg:sticky lg:top-4 lg:-m-2 lg:max-h-[calc(100dvh-7rem)] lg:overflow-y-auto lg:p-2",
                )}
            >
                {list}
            </section>

            <section aria-label="Ticket details" className={detailOpen ? "block" : "hidden lg:block"}>
                {children}
            </section>
        </div>
    );
}