"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Field, inputStyles } from "@/components/ui/field";
import { login, type LoginState } from "./actions";

export function LoginForm() {
    const [state, formAction, pending] = useActionState<LoginState, FormData>(login, null);

    return (
        <form action={formAction} className="flex flex-col gap-4">
            <Field id="email" label="Email">
                <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="username"
                    required
                    className={inputStyles}
                />
            </Field>

            <Field id="password" label="Password" error={state?.error}>
                <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    aria-describedby="password-error"
                    className={inputStyles}
                />
            </Field>

            <Button type="submit" size="lg" tone="pink" fullWidth disabled={pending}>
                {pending ? "Signing in..." : "Sign in"}
            </Button>
        </form>
    );
}