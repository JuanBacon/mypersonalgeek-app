import { cn } from "@/lib/cn";
import { ticketPriorities } from "@/lib/schemas/ticket";
import { priorityMeta } from "@/lib/ticket-ui";
import { toneClasses } from "@/components/ui/tone";

export function PriorityPicker({ defaultValue = "normal" }: { defaultValue?: string }) {
    return (
        <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 font-display text-xl uppercase">How urgent is this?</legend>

            <div className="grid grid-cols-3 gap-3">
                {ticketPriorities.map((priority) => {
                    const meta = priorityMeta[priority];

                    return (
                        <label key={priority} className="cursor-pointer">
                            <input
                                type="radio"
                                name="priority"
                                value={priority}
                                defaultChecked={priority === defaultValue}
                                className="peer sr-only"
                            />
                            <span
                                className={cn(
                                    "flex h-full min-h-28 flex-col items-center justify-center gap-1 rounded-xl border-4 border-ink p-2",
                                    "text-center text-sm font-bold shadow-brutal",
                                    "transition-[transform,box-shadow] duration-100 motion-reduce:transition-none",
                                    "hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lg",
                                    "peer-checked:translate-x-1 peer-checked:translate-y-1 peer-checked:shadow-none",
                                    "peer-checked:ring-4 peer-checked:ring-ink peer-checked:ring-offset-2 peer-checked:ring-offset-cream",
                                    "peer-focus-visible:outline-4 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-ink",
                                    toneClasses[meta.tone],
                                )}
                            >
                                <span aria-hidden className="text-3xl">
                                    {meta.emoji}
                                </span>
                                {meta.label}
                            </span>
                        </label>
                    );
                })}
            </div>
        </fieldset>
    );
}