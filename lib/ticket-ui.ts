import type { TicketPriority, TicketStatus } from "./schemas/ticket";
import type { Tone } from "../components/ui/tone";

export const statusLabel: Record<TicketStatus, string> = {
    open: "Open",
    in_progress: "In progress",
    waiting_on_user: "Needs you",
    resolved: "Fixed",
    closed: "Closed",
};

export const priorityMeta: Record<
    TicketPriority,
    { label: string; emoji: string; tone: Tone }
> = {
    low: { label: "Whenever you have time", emoji: "🟢", tone: "green" },
    normal: { label: "Kinda annoying", emoji: "🟡", tone: "yellow" },
    high: { label: "Everything is on fire!", emoji: "🔴", tone: "red" },
};

export function isFinished(status: TicketStatus): boolean {
    return status === "resolved" || status === "closed";
}

// "Urgent" = high priority and not finished yet.
export function isUrgent(status: TicketStatus, priority: TicketPriority): boolean {
    return priority === "high" && !isFinished(status);
}

// Which color a ticket card gets.
export function cardTone(status: TicketStatus, priority: TicketPriority): Tone {
    if (isFinished(status)) return "green";
    if (priority === "high") return "blue";
    if (status === "in_progress") return "yellow";
    if (status === "waiting_on_user") return "pink";
    return "white";
}

export function statusMessage(status: TicketStatus): string {
    switch (status) {
        case "open":
            return "Your geek has been notified! 👾";
        case "in_progress":
            return "IT is on it! 🛠️";
        case "waiting_on_user":
            return "Your geek needs something from you 👀";
        case "resolved":
            return "Fixed! 🎉";
        case "closed":
            return "Closed. 📦";
    }
}

export type TicketListItem = {
    id: string;
    title: string;
    status: TicketStatus;
    priority: TicketPriority;
    ago: string;
    attachmentCount: number;
};

// Numbers for the admin summary badges.
export function summarize(tickets: { status: TicketStatus }[]) {
    const counts = { pending: 0, active: 0, fixed: 0 };

    for (const { status } of tickets) {
        if (status === "open") counts.pending += 1;
        else if (status === "in_progress" || status === "waiting_on_user") counts.active += 1;
        else counts.fixed += 1;
    }

    return counts;
}