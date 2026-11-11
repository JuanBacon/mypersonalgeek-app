import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Viewer } from "@/lib/auth/viewer";
import type { TicketPriority, TicketStatus } from "@/lib/schemas/ticket";
import { timeAgo } from "@/lib/time-ago";
import { cardTone, isUrgent, priorityMeta, statusLabel } from "@/lib/ticket-ui";
import { AdminActions, RequesterActions } from "./ticket-actions";

export type TicketDetailData = {
    id: string;
    title: string;
    description: string;
    status: TicketStatus;
    priority: TicketPriority;
    created_at: string;
    created_by: string;
    category: { label: string } | null;
    creator: { display_name: string } | null;
    attachments: { id: string; original_name: string; mime_type: string }[];
    comments: { id: string; body: string; author_id: string; created_at: string }[];
};

export function TicketDetail({ ticket, viewer }: { ticket: TicketDetailData; viewer: Viewer }) {
    const tone = cardTone(ticket.status, ticket.priority);
    const priority = priorityMeta[ticket.priority];
    const creatorName = ticket.creator?.display_name ?? "Unknown";

    // A requester cannot read the admin's profile row (by design), so we label
    // authors by role instead of looking up names.
    const authorLabel = (authorId: string) => {
        if (authorId === viewer.id) return "You";
        return viewer.isAdmin ? creatorName : "Your geek";
    };

    return (
        <article className="flex flex-col gap-5">
            <Card tone={tone} className="flex flex-col gap-3 p-5">
                <div className="flex flex-wrap gap-2">
                    <Badge tone="white">{statusLabel[ticket.status]}</Badge>
                    {isUrgent(ticket.status, ticket.priority) && <Badge tone="red">Urgent</Badge>}
                </div>

                <h2 className="font-display text-3xl leading-tight sm:text-4xl">{ticket.title}</h2>

                <p className="text-sm font-bold">
                    {ticket.category?.label ?? "Archived category"} · {priority.emoji} {priority.label} ·{" "}
                    {timeAgo(new Date(ticket.created_at))}
                </p>

                {viewer.isAdmin && (
                    <Badge tone="white" className="self-start">
                        From: {creatorName} 💖
                    </Badge>
                )}
            </Card>

            <Card className="flex flex-col gap-3">
                <h3 className="font-display text-xl uppercase">What&apos;s going wrong?</h3>
                <p className="whitespace-pre-wrap break-words font-medium">{ticket.description}</p>

                {ticket.attachments.length > 0 && (
                    <ul className="flex flex-wrap gap-2">
                        {ticket.attachments.map((attachment) => (
                            <li key={attachment.id}>
                                <Badge tone="yellow">📎 {attachment.original_name}</Badge>
                            </li>
                        ))}
                    </ul>
                )}
            </Card>

            <section aria-label="Conversation" className="flex flex-col gap-3">
                <h3 className="font-display text-xl uppercase">Conversation</h3>

                {ticket.comments.length === 0 ? (
                    <p className="font-medium">No messages yet.</p>
                ) : (
                    <ul className="flex flex-col gap-3">
                        {ticket.comments.map((comment) => (
                            <li key={comment.id}>
                                <Card tone={comment.author_id === viewer.id ? "yellow" : "white"} className="p-3">
                                    <p className="text-xs font-bold uppercase">
                                        {authorLabel(comment.author_id)} · {timeAgo(new Date(comment.created_at))}
                                    </p>
                                    <p className="mt-1 whitespace-pre-wrap break-words font-medium">{comment.body}</p>
                                </Card>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            {viewer.isAdmin ? <AdminActions /> : <RequesterActions status={ticket.status} />}
        </article>
    );
}