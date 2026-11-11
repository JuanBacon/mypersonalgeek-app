import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export type Viewer = { id: string; displayName: string; isAdmin: boolean };

// `cache` makes this run once per request, even if the layout and the page
// both call it.
export const getViewer = cache(async (): Promise<Viewer | null> => {
    const supabase = await createClient();

    const { data } = await supabase.auth.getClaims();
    const id = data?.claims.sub;
    if (!id) return null;

    const { data: profile } = await supabase
        .from("users")
        .select("display_name, user_role")
        .eq("id", id)
        .single();

    return {
        id,
        displayName: profile?.display_name ?? "friend",
        isAdmin: profile?.user_role === "admin",
    };
});