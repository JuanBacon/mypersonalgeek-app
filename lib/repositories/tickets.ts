import type { SupabaseClient } from "@supabase/supabase-js";
import type { TicketsRepo } from "../services/create-ticket";

export function makeTicketsRepo(supabase: SupabaseClient): TicketsRepo {
    return {
        async insert(ticket) {
            const { data, error } = await supabase
                .from("tickets")
                .insert({
                    created_by: ticket.createdBy,
                    category_id: ticket.categoryId,
                    title: ticket.title,
                    description: ticket.description,
                    priority: ticket.priority,
                })
                .select("id")
                .single();

            if (error) {
                throw new Error(`Failed to create ticket: ${error.message}`);
            }
            return { id: data.id };
        },
    };
}