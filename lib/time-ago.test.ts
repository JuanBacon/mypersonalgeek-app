import { describe, it, expect } from "vitest";
import { timeAgo } from "./time-ago";

const now = new Date("2026-11-10T12:00:00Z");
const ago = (seconds: number) => new Date(now.getTime() - seconds * 1000);

describe("timeAgo", () => {
    it("says just now for under a minute", () => {
        expect(timeAgo(ago(30), now)).toBe("just now");
    });

    it("treats a date slightly in the future as just now", () => {
        expect(timeAgo(ago(-20), now)).toBe("just now");
    });

    it("formats hours", () => {
        expect(timeAgo(ago(2 * 3600), now)).toBe("2 hours ago");
    });

    it("says yesterday for one day", () => {
        expect(timeAgo(ago(86_400), now)).toBe("yesterday");
    });

    it("formats several days", () => {
        expect(timeAgo(ago(3 * 86_400), now)).toBe("3 days ago");
    });
});