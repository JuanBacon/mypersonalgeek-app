import { describe, it, expect, vi } from "vitest";
import { createTicket } from "./create-ticket";

const categoryId = "3f2b8a52-6d1e-4c7a-9b35-1a2f4c6d8e90";

const validInput = {
    title: "Laptop won't connect to Wi-Fi",
    description: "Since this morning my laptop shows no networks available.",
    categoryId,
};

function makeDeps(activeCategoryIds: string[]) {
    const insert = vi.fn(async (_ticket: unknown) => ({ id: "ticket-1" }));

    return {
        insert,
        deps: {
            categories: {
                findActiveById: async (id: string) =>
                    activeCategoryIds.includes(id) ? { id } : null,
            },
            tickets: { insert },
        },
    };
}

describe("createTicket", () => {
    it("creates the ticket when the category is active", async () => {
        const { deps, insert } = makeDeps([categoryId]);

        const result = await createTicket(validInput, "user-1", deps);

        expect(result).toEqual({ ok: true, ticketId: "ticket-1" });
        expect(insert).toHaveBeenCalledTimes(1);
    });

    it("rejects an unknown or inactive category and inserts nothing", async () => {
        const { deps, insert } = makeDeps([]);

        const result = await createTicket(validInput, "user-1", deps);

        expect(result.ok).toBe(false);
        expect(insert).not.toHaveBeenCalled();
    });

    it("returns field errors for invalid input and inserts nothing", async () => {
        const { deps, insert } = makeDeps([categoryId]);

        const result = await createTicket({ ...validInput, title: "" }, "user-1", deps);

        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.errors.some((e) => e.field === "title")).toBe(true);
        }
        expect(insert).not.toHaveBeenCalled();
    });
});