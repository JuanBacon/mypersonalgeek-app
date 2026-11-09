import type { SupabaseClient } from "@supabase/supabase-js";
import type { CategoriesRepo } from "../services/create-ticket";

export type CategoryOption = { id: string; label: string };

export type CategoriesQueries = CategoriesRepo & {
    listActive(): Promise<CategoryOption[]>;
};

export function makeCategoriesRepo(supabase: SupabaseClient): CategoriesQueries {
    return {
        async findActiveById(id) {
            const { data, error } = await supabase
                .from("categories")
                .select("id")
                .eq("id", id)
                .eq("is_active", true)
                .maybeSingle();

            if (error) {
                throw new Error(`Failed to load category: ${error.message}`);
            }
            return data;
        },

        async listActive() {
            const { data, error } = await supabase
                .from("categories")
                .select("id, label")
                .eq("is_active", true)
                .order("sort_order")
                .order("label");

            if (error) {
                throw new Error(`Failed to load categories: ${error.message}`);
            }
            return data ?? [];
        },
    };
}