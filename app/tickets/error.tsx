"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function TicketsError({ reset }: { error: Error; reset: () => void }) {
    return (
        <Card tone="red" className="mx-auto mt-10 flex max-w-md flex-col items-center gap-4 text-center">
            <p className="font-display text-2xl uppercase">Something broke 💥</p>
            <p className="font-medium">Try again. If it keeps happening, tell your geek.</p>
            <Button tone="white" onClick={reset}>
                Try again
            </Button>
        </Card>
    );
}