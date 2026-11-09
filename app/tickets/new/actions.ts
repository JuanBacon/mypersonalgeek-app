"use server";

import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";
import { createTicket, type FieldError } from "../../../lib/services/create-ticket";
import { makeCategoriesRepo } from "../../../lib/repositories/categories";
import { makeTicketsRepo } from "../../../lib/repositories/tickets";

export type TicketFormValues = {
    title: string;
    description: string;
    categoryId: string;
    priority: string;
};

export type CreateTicketState = {
    errors: FieldError[];
    values: TicketFormValues;
} | null;

export async function createTicketAction(
    _previousState: CreateTicketState,
    formData: FormData,
): Promise<CreateTicketState> {
    const supabase = await createClient();

    // A Server Action is a public endpoint. Verify the user with Supabase itself
    // on every write, instead of trusting anything the browser sent.
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const values: TicketFormValues = {
        title: String(formData.get("title") ?? ""),
        description: String(formData.get("description") ?? ""),
        categoryId: String(formData.get("categoryId") ?? ""),
        priority: String(formData.get("priority") ?? ""),
    };

    const result = await createTicket(
        { ...values, priority: values.priority || undefined },
        user.id,
        {
            categories: makeCategoriesRepo(supabase),
            tickets: makeTicketsRepo(supabase),
        },
    );

    if (!result.ok) {
        return { errors: result.errors, values };
    }

    redirect("/tickets");
}