import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function TicketNotFound() {
    return (
        <Card className="flex flex-col items-center gap-4 py-12 text-center">
            <span aria-hidden className="text-5xl">
                🕵️
            </span>
            <p className="font-display text-2xl uppercase">Ticket not found</p>
            <Link href="/tickets" className={buttonStyles({ tone: "blue" })}>
                Back to tickets
            </Link>
        </Card>
    );
}