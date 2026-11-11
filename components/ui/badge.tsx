import { cn } from "@/lib/cn";
import { toneClasses, type Tone } from "./tone";

export function Badge({
    tone = "yellow",
    className,
    ...props
}: React.ComponentProps<"span"> & { tone?: Tone }) {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1 rounded-lg border-[3px] border-ink px-2 py-0.5",
                "font-display text-xs uppercase tracking-wide shadow-brutal-sm",
                toneClasses[tone],
                className,
            )}
            {...props}
        />
    );
}