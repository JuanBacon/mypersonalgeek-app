import Link from "next/link";
import { Card } from "@/components/ui/card";
import { makeCategoriesRepo } from "@/lib/repositories/categories";
import { createClient } from "@/lib/supabase/server";
import { TicketForm } from "./ticket-form";

export default async function NewTicketPage() {
    const supabase = await createClient();
    const categories = await makeCategoriesRepo(supabase).listActive();

    return (
        <div className="flex flex-col gap-5">
            <Link href="/tickets" className="font-display uppercase underline lg:hidden">
                ← All tickets
            </Link>

            <Card className="flex flex-col gap-6 p-5 sm:p-6">
                <h2 className="flex items-center gap-2 font-display text-3xl uppercase">
                    <span aria-hidden>👓</span> New ticket
                </h2>
                <TicketForm categories={categories} />
            </Card>
        </div>
    );
}