import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { inputStyles } from "@/components/ui/field";
import type { TicketStatus } from "@/lib/schemas/ticket";
import { statusMessage } from "@/lib/ticket-ui";

// TODO(lesson-6): these controls are visual only for now. Lesson 6 connects them
// to server actions with validated status transitions.

export function RequesterActions({ status }: { status: TicketStatus }) {
    return (
        <Card className="flex flex-col gap-4">
            <p className="font-display text-2xl">{statusMessage(status)}</p>

            <div className="grid grid-cols-2 gap-3">
                <Button tone="blue" disabled>
                    Let&apos;s chat
                </Button>
                <Button tone="white" disabled>
                    It&apos;s fixed!
                </Button>
            </div>

            <p className="text-sm font-medium">These buttons are switched on in the next lesson.</p>
        </Card>
    );
}

export function AdminActions() {
    return (
        <Card className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
                <Button tone="blue" disabled>
                    Working on it
                </Button>
                <Button tone="green" disabled>
                    Fixed it!
                </Button>
            </div>

            <label htmlFor="quick-note" className="sr-only">
                Quick note
            </label>
            <textarea
                id="quick-note"
                rows={3}
                disabled
                placeholder="Add a quick note..."
                className={inputStyles}
            />

            <Button tone="red" size="lg" fullWidth disabled>
                Send update
            </Button>

            <p className="text-sm font-medium">These controls are switched on in the next lesson.</p>
        </Card>
    );
}