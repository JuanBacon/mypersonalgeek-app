import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";
import { TicketDetail, type TicketDetailData } from "@/components/tickets/ticket-detail";
import { getViewer } from "@/lib/auth/viewer";
import { createClient } from "@/lib/supabase/server";

export default async function TicketPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Reject a malformed id before it reaches the database.
    if (!z.uuid().safeParse(id).success) {
        notFound();
    }

    const viewer = await getViewer();
    if (!viewer) redirect("/login");

    const supabase = await createClient();

    const { data, error } = await supabase
        .from("tickets")
        .select(
            `id, title, description, status, priority, created_at, created_by,
       category:categories(label),
       creator:users!created_by(display_name),
       attachments(id, original_name, mime_type),
       comments(id, body, author_id, created_at)`,
        )
        .eq("id", id)
        .order("created_at", { referencedTable: "comments", ascending: true })
        .maybeSingle();

    if (error) {
        throw new Error(`Failed to load ticket: ${error.message}`);
    }

    // RLS hides tickets that are not hers, so someone else's id looks exactly
    // like an id that doesn't exist.
    if (!data) {
        notFound();
    }

    return (
        <div className="flex flex-col gap-5">
            <Link href="/tickets" className="font-display uppercase underline lg:hidden">
                ← All tickets
            </Link>
            <TicketDetail ticket={data as unknown as TicketDetailData} viewer={viewer} />
        </div>
    );
}