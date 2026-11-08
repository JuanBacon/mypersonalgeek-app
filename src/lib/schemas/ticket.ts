import { z } from "zod";

export const ticketPriorities = ["low", "normal", "high"] as const;

export const ticketStatuses = [
    "open",
    "in_progress",
    "waiting_on_user",
    "resolved",
    "closed",
] as const;

export const createTicketSchema = z.object({
    title: z.string().trim()
        .min(5, "The title must have at least 5 characters")
        .max(100, "The title cannot exceed 100 characters"),
    description: z.string().trim()
        .min(10, "Please describe the problem in at least 10 characters")
        .max(5000, "The description cannot exceed 5000 characters"),
    // Shape only. Whether the category exists and is active is checked by the service.
    categoryId: z.uuid("Please choose a category"),
    priority: z.enum(ticketPriorities).default("normal"),
    // Forms send "" for an empty field; turn it into undefined before validating.

});

export type CreateTicketInput = z.infer<typeof createTicketSchema>;
export type TicketPriority = (typeof ticketPriorities)[number];
export type TicketStatus = (typeof ticketStatuses)[number];