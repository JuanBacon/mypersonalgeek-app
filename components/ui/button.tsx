import { cn } from "@/lib/cn";
import { pressable } from "./pressable";
import { toneClasses, type Tone } from "./tone";

type Size = "sm" | "md" | "lg";

const sizeClasses: Record<Size, string> = {
    sm: "min-h-10 px-3 text-sm",
    md: "min-h-12 px-5 text-base",
    lg: "min-h-16 px-6 text-xl sm:text-2xl",
};

type StyleOptions = { tone?: Tone; size?: Size; fullWidth?: boolean };

// Exported separately so a <Link> can look exactly like a button.
export function buttonStyles({
    tone = "pink",
    size = "md",
    fullWidth = false,
}: StyleOptions = {}) {
    return cn(
        "inline-flex select-none items-center justify-center gap-2 rounded-xl border-4 border-ink",
        "font-display uppercase tracking-wide shadow-brutal",
        pressable,
        "disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none",
        toneClasses[tone],
        sizeClasses[size],
        fullWidth && "w-full",
    );
}

type ButtonProps = React.ComponentProps<"button"> & StyleOptions;

export function Button({
    tone,
    size,
    fullWidth,
    className,
    type = "button",
    ...props
}: ButtonProps) {
    return (
        <button
            type={type}
            className={cn(buttonStyles({ tone, size, fullWidth }), className)}
            {...props}
        />
    );
}