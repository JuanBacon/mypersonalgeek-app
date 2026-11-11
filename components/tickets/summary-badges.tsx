import { Card } from "@/components/ui/card";
import type { Tone } from "@/components/ui/tone";

type Counts = { pending: number; active: number; fixed: number };

export function SummaryBadges({ counts }: { counts: Counts }) {
    const items: { label: string; value: number; tone: Tone }[] = [
        { label: "Pending", value: counts.pending, tone: "yellow" },
        { label: "Active", value: counts.active, tone: "blue" },
        { label: "Fixed", value: counts.fixed, tone: "green" },
    ];

    return (
        <ul aria-label="Ticket summary" className="grid grid-cols-3 gap-3">
            {items.map((item) => (
                <li key={item.label}>
                    <Card tone={item.tone} className="flex flex-col items-center p-2 sm:p-3">
                        <span className="font-display text-3xl leading-none">{item.value}</span>
                        <span className="font-display text-xs uppercase">{item.label}</span>
                    </Card>
                </li>
            ))}
        </ul>
    );
}