import { describe, it, expect } from "vitest";
import { createTicketSchema } from "./ticket";

const validTicket = {
    title: "Laptop won't connect to Wi-Fi",
    description: "Since this morning my laptop shows no networks available.",
    categoryId: "3f2b8a52-6d1e-4c7a-9b35-1a2f4c6d8e90",
};

describe("createTicketSchema", () => {
    it("accepts a valid ticket", () => {
        const result = createTicketSchema.safeParse(validTicket);

        expect(result.success).toBe(true);
    });

    it("rejects an empty title", () => {
        const result = createTicketSchema.safeParse({ ...validTicket, title: "" });

        expect(result.success).toBe(false);
    });

    it("rejects a title made only of spaces", () => {
        const result = createTicketSchema.safeParse({ ...validTicket, title: "       " });

        expect(result.success).toBe(false);
    });

    it("rejects a description over 5000 characters", () => {
        const result = createTicketSchema.safeParse({
            ...validTicket,
            description: "a".repeat(5001),
        });

        expect(result.success).toBe(false);
    });

    it("rejects a category id that is not a uuid", () => {
        const result = createTicketSchema.safeParse({ ...validTicket, categoryId: "network" });

        expect(result.success).toBe(false);
    });

    it("defaults the priority to normal", () => {
        const data = createTicketSchema.parse(validTicket);

        expect(data.priority).toBe("normal");
    });

    it("rejects an unknown priority", () => {
        const result = createTicketSchema.safeParse({ ...validTicket, priority: "banana" });

        expect(result.success).toBe(false);
    });
});