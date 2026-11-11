import { Card } from "@/components/ui/card";
import { LoginForm } from "./login-form";

export default function LoginPage() {
    return (
        <main className="flex min-h-dvh flex-col items-center justify-center gap-6 p-4">
            <h1 className="flex items-center gap-2 font-display text-4xl sm:text-5xl">
                <span aria-hidden>👓</span> MYPERSONALGEEK
            </h1>

            <Card className="flex w-full max-w-sm flex-col gap-5 p-6">
                <p className="font-display text-2xl uppercase">Sign in</p>
                <LoginForm />
            </Card>
        </main>
    );
}