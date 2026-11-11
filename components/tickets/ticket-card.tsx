"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { cardStyles } from "@/components/ui/card";
import { pressable } from "@/components/ui/pressable";
import { cn } from "@/lib/cn";
import { cardTone, isUrgent, statusLabel, type TicketListItem } from "@/lib/ticket-ui";

export function TicketCard({ ticket }: { ticket: TicketListItem }) {
    const pathname = usePathname();
    const href = `/tickets/${ticket.id}`;
    const active = pathname === href;
    const urgent = isUrgent(ticket.status, ticket.priority);
    const tone = cardTone(ticket.status, ticket.priority);

    return (
        <li className="relative pt-3">
            <div className="absolute right-4 top-0 z-10 flex gap-2">
                <Badge tone="white">{statusLabel[ticket.status]}</Badge>
                {urgent && <Badge tone="red">Urgent</Badge>}
            </div>

            <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                    "block pt-5",
                    cardStyles(tone),
                    pressable,
                    // The open ticket looks permanently pressed in.
                    active && "translate-x-1 translate-y-1 shadow-none",
                )}
            >
                <span className="block font-display text-2xl leading-tight">{ticket.title}</span>
                <span className="mt-2 flex flex-wrap items-center gap-2 text-sm font-bold">
                    <span>{ticket.ago}</span>
                    {ticket.attachmentCount > 0 && (
                        <Badge tone="white">
                            📎 {ticket.attachmentCount} {ticket.attachmentCount === 1 ? "attachment" : "attachments"}
                        </Badge>
                    )}
                </span>
            </Link>
        </li>
    );
}