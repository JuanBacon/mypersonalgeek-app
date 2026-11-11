import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { TicketListItem } from "@/lib/ticket-ui";
import { SummaryBadges } from "./summary-badges";
import { TicketCard } from "./ticket-card";

type Counts = { pending: number; active: number; fixed: number };

export function TicketList({
    tickets,
    isAdmin,
    counts,
}: {
    tickets: TicketListItem[];
    isAdmin: boolean;
    counts: Counts;
}) {
    return (
        <div className="flex flex-col gap-5">
            <h1 className="font-display text-3xl uppercase leading-none sm:text-4xl">
                {isAdmin ? "The Geek's Dashboard" : "Ticket Status"}
            </h1>

            {isAdmin && <SummaryBadges counts={counts} />}

            <Link href="/tickets/new" className={buttonStyles({ tone: "pink", fullWidth: true })}>
                + New ticket
            </Link>

            {tickets.length === 0 ? (
                <Card className="text-center font-bold">No tickets yet 🎉</Card>
            ) : (
                <ul className="flex flex-col gap-4">
                    {tickets.map((ticket) => (
                        <TicketCard key={ticket.id} ticket={ticket} />
                    ))}
                </ul>
            )}
        </div>
    );
}