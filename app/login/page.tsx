import { LoginForm } from "./login-form";

export default function LoginPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
            <h1 className="text-2xl font-semibold">Sign in</h1>
            <LoginForm />
        </main>
    );
}