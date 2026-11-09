import Link from "next/link";
import { createClient } from "../../lib/supabase/server";

type TicketRow = {
    id: string;
    title: string;
    status: string;
    priority: string;
    created_at: string;
    category: { label: string } | null;
};

const dateFormat = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
});

export default async function TicketsPage() {
    const supabase = await createClient();

    // No filter here on purpose: RLS decides which rows come back.
    // A requester gets her own tickets, an admin gets all of them.
    const { data, error } = await supabase
        .from("tickets")
        .select("id, title, status, priority, created_at, category:categories(label)")
        .order("created_at", { ascending: false });

    if (error) {
        throw new Error(`Failed to load tickets: ${error.message}`);
    }

    // The client has no generated database types yet, so we state the row shape.
    const tickets = (data ?? []) as unknown as TicketRow[];

    return (
        <main className="mx-auto flex max-w-3xl flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Tickets</h1>
                <Link href="/tickets/new" className="rounded bg-black px-4 py-2 text-white">
                    New ticket
                </Link>
            </div>

            {tickets.length === 0 ? (
                <p>No tickets yet.</p>
            ) : (
                <ul className="flex flex-col divide-y rounded border">
                    {tickets.map((ticket) => (
                        <li key={ticket.id} className="flex flex-col gap-1 p-4">
                            <span className="font-medium">{ticket.title}</span>
                            <span className="text-sm text-gray-600">
                                {ticket.category?.label ?? "Archived category"} · {ticket.status} ·{" "}
                                {ticket.priority} · {dateFormat.format(new Date(ticket.created_at))}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </main>
    );
}