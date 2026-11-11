import { cn } from "@/lib/cn";

export const inputStyles = cn(
    "w-full rounded-xl border-4 border-ink bg-white px-4 py-3 text-base font-medium shadow-brutal",
    "placeholder:text-ink/50 disabled:opacity-60",
    "focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-geek-blue",
);

type FieldProps = {
    id: string;
    label: string;
    hint?: string;
    error?: string;
    children: React.ReactNode;
};

// Label + control + optional hint + error message, wired together.
// The control should set aria-describedby to `${id}-hint` and `${id}-error`.
export function Field({ id, label, hint, error, children }: FieldProps) {
    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={id} className="font-display text-xl uppercase">
                {label}
            </label>
            {children}
            {hint && (
                <p id={`${id}-hint`} className="text-sm font-medium">
                    {hint}
                </p>
            )}
            <p id={`${id}-error`} role="alert" className="min-h-5 text-sm font-bold text-geek-red">
                {error}
            </p>
        </div>
    );
}