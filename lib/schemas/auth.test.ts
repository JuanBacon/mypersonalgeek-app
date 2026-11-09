import { describe, it, expect } from "vitest";
import { loginSchema } from "./auth";

describe("loginSchema", () => {
    it("accepts a valid login", () => {
        const result = loginSchema.safeParse({ email: "a@b.co", password: "secret" });

        expect(result.success).toBe(true);
    });

    it("normalizes the email (trim and lowercase)", () => {
        const data = loginSchema.parse({ email: "  Person@Example.COM ", password: "x" });

        expect(data.email).toBe("person@example.com");
    });

    it("rejects an invalid email", () => {
        const result = loginSchema.safeParse({ email: "not-an-email", password: "x" });

        expect(result.success).toBe(false);
    });

    it("rejects an empty password", () => {
        const result = loginSchema.safeParse({ email: "a@b.co", password: "" });

        expect(result.success).toBe(false);
    });

    it("keeps spaces inside the password", () => {
        const data = loginSchema.parse({ email: "a@b.co", password: " pass word " });

        expect(data.password).toBe(" pass word ");
    });
});