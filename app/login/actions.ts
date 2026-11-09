"use server";

import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import { loginSchema } from "../../lib/schemas/auth";

export type LoginState = { error: string } | null;

export async function login(
    _previousState: LoginState,
    formData: FormData,
): Promise<LoginState> {
    const parsed = loginSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    });

    if (!parsed.success) {
        return { error: "Enter a valid email and password." };
    }
    console.log("parsed.data", parsed.data);
    const supabase = await createClient();
    
    console.log("supabase", supabase);
    const { error } = await supabase.auth.signInWithPassword(parsed.data);

    if (error) {
        // Same message for a wrong email and a wrong password, so the form never
        console.error("SUPABASE ERROR DETAILS:", error.message, error.status);
        // reveals which accounts exist.
        return { error: "Incorrect email or password." };
    }

    redirect("/");
}

export async function logout() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
}