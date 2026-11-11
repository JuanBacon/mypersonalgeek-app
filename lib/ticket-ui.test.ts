import { describe, it, expect } from "vitest";
import { cardTone, isUrgent, summarize } from "./ticket-ui";

describe("cardTone", () => {
    it("is green for finished tickets, even if high priority", () => {
        expect(cardTone("resolved", "high")).toBe("green");
        expect(cardTone("closed", "normal")).toBe("green");
    });

    it("is blue for unfinished high priority tickets", () => {
        expect(cardTone("open", "high")).toBe("blue");
        expect(cardTone("in_progress", "high")).toBe("blue");
    });

    it("is yellow when in progress with normal or low priority", () => {
        expect(cardTone("in_progress", "normal")).toBe("yellow");
    });

    it("is pink when waiting on the user", () => {
        expect(cardTone("waiting_on_user", "low")).toBe("pink");
    });

    it("is white for a plain open ticket", () => {
        expect(cardTone("open", "normal")).toBe("white");
    });
});

describe("isUrgent", () => {
    it("is true only for unfinished high priority tickets", () => {
        expect(isUrgent("open", "high")).toBe(true);
        expect(isUrgent("resolved", "high")).toBe(false);
        expect(isUrgent("open", "normal")).toBe(false);
    });
});

describe("summarize", () => {
    it("groups statuses into pending, active and fixed", () => {
        const counts = summarize([
            { status: "open" },
            { status: "open" },
            { status: "in_progress" },
            { status: "waiting_on_user" },
            { status: "resolved" },
            { status: "closed" },
        ]);

        expect(counts).toEqual({ pending: 2, active: 2, fixed: 2 });
    });

    it("returns zeros for an empty list", () => {
        expect(summarize([])).toEqual({ pending: 0, active: 0, fixed: 0 });
    });
});