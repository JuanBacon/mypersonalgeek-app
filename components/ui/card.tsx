import { cn } from "@/lib/cn";
import { toneClasses, type Tone } from "./tone";

export function cardStyles(tone: Tone = "white") {
    return cn("rounded-2xl border-4 border-ink p-4 shadow-brutal", toneClasses[tone]);
}

export function Card({
    tone = "white",
    className,
    ...props
}: React.ComponentProps<"div"> & { tone?: Tone }) {
    return <div className={cn(cardStyles(tone), className)} {...props} />;
}