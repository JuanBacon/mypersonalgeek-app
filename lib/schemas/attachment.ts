import { z } from "zod";

export const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024; // 5 MB
export const MAX_ATTACHMENTS_PER_TICKET = 5;

export const allowedAttachmentTypes = [
    "image/png",
    "image/jpeg",
    "image/webp",
    "application/pdf",
    "text/plain",
] as const;

export const attachmentFileSchema = z
    .instanceof(File, { message: "Please select a file" })
    .refine((file) => file.size > 0, "The file is empty")
    .refine(
        (file) => file.size <= MAX_ATTACHMENT_BYTES,
        "The file cannot exceed 5 MB",
    )
    .refine(
        (file) => (allowedAttachmentTypes as readonly string[]).includes(file.type),
        "Only PNG, JPEG, WebP, PDF, or plain text files are allowed",
    );

export const attachmentsSchema = z
    .array(attachmentFileSchema)
    .max(MAX_ATTACHMENTS_PER_TICKET, "You can attach up to 5 files");