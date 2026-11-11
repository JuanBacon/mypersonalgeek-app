import { redirect } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { TicketList } from "@/components/tickets/ticket-list";
import { TicketsShell } from "@/components/tickets/tickets-shell";
import { getViewer } from "@/lib/auth/viewer";
import { createClient } from "@/lib/supabase/server";
import type { TicketPriority, TicketStatus } from "@/lib/schemas/ticket";
import { timeAgo } from "@/lib/time-ago";
import { summarize, type TicketListItem } from "@/lib/ticket-ui";

type RawTicket = {
    id: string;
    title: string;
    status: TicketStatus;
    priority: TicketPriority;
    created_at: string;
    attachments: { count: number }[];
};

export default async function TicketsLayout({ children }: { children: React.ReactNode }) {
    const viewer = await getViewer();
    if (!viewer) redirect("/login");

    const supabase = await createClient();

    // No filter on purpose: RLS returns her own tickets, or all of them for the admin.
    const { data, error } = await supabase
        .from("tickets")
        .select("id, title, status, priority, created_at, attachments(count)")
        .order("created_at", { ascending: false });

    if (error) {
        throw new Error(`Failed to load tickets: ${error.message}`);
    }

    const now = new Date();

    // The client has no generated database types yet, so we state the row shape.
    const tickets: TicketListItem[] = ((data ?? []) as unknown as RawTicket[]).map((row) => ({
        id: row.id,
        title: row.title,
        status: row.status,
        priority: row.priority,
        ago: timeAgo(new Date(row.created_at), now),
        attachmentCount: row.attachments[0]?.count ?? 0,
    }));

    return (
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 sm:p-6">
            <AppHeader displayName={viewer.displayName} />

            <main id="main">
                <TicketsShell
                    list={
                        <TicketList tickets={tickets} isAdmin={viewer.isAdmin} counts={summarize(tickets)} />
                    }
                >
                    {children}
                </TicketsShell>
            </main>
        </div>
    );
}