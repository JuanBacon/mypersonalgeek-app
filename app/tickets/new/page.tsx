import Link from "next/link";
import { createClient } from "../../../lib/supabase/server";
import { makeCategoriesRepo } from "../../../lib/repositories/categories";
import { TicketForm } from "./ticket-form";

export default async function NewTicketPage() {
    const supabase = await createClient();
    const categories = await makeCategoriesRepo(supabase).listActive();

    return (
        <main className="mx-auto flex max-w-xl flex-col gap-6 p-6">
            <Link href="/tickets" className="text-sm underline">
                Back to tickets
            </Link>
            <h1 className="text-2xl font-semibold">New ticket</h1>
            <TicketForm categories={categories} />
        </main>
    );
}