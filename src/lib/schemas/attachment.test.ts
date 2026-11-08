import { describe, it, expect } from "vitest";
import {
    attachmentFileSchema,
    attachmentsSchema,
    MAX_ATTACHMENT_BYTES,
    MAX_ATTACHMENTS_PER_TICKET,
} from "./attachment";

const makeFile = (name: string, type: string, size = 10) =>
    new File([new Uint8Array(size)], name, { type });

describe("attachmentFileSchema", () => {
    it("accepts a valid png", () => {
        const result = attachmentFileSchema.safeParse(makeFile("error.png", "image/png"));

        expect(result.success).toBe(true);
    });

    it("rejects an empty file", () => {
        const result = attachmentFileSchema.safeParse(makeFile("empty.png", "image/png", 0));

        expect(result.success).toBe(false);
    });

    it("rejects a file over the size limit", () => {
        const big = makeFile("big.png", "image/png", MAX_ATTACHMENT_BYTES + 1);

        expect(attachmentFileSchema.safeParse(big).success).toBe(false);
    });

    it("accepts a file exactly at the size limit", () => {
        const exact = makeFile("exact.png", "image/png", MAX_ATTACHMENT_BYTES);

        expect(attachmentFileSchema.safeParse(exact).success).toBe(true);
    });

    it("rejects svg files", () => {
        const svg = makeFile("logo.svg", "image/svg+xml");

        expect(attachmentFileSchema.safeParse(svg).success).toBe(false);
    });
});

describe("attachmentsSchema", () => {
    it("accepts the maximum number of files", () => {
        const files = Array.from({ length: MAX_ATTACHMENTS_PER_TICKET }, (_, i) =>
            makeFile(`file-${i}.png`, "image/png"),
        );

        expect(attachmentsSchema.safeParse(files).success).toBe(true);
    });

    it("rejects more files than the maximum", () => {
        const files = Array.from({ length: MAX_ATTACHMENTS_PER_TICKET + 1 }, (_, i) =>
            makeFile(`file-${i}.png`, "image/png"),
        );

        expect(attachmentsSchema.safeParse(files).success).toBe(false);
    });
});