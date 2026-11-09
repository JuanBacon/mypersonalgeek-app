import { createTicketSchema, type CreateTicketInput } from "../schemas/ticket";

export interface CategoriesRepo {
    findActiveById(id: string): Promise<{ id: string } | null>;
}

export interface TicketsRepo {
    insert(ticket: CreateTicketInput & { createdBy: string }): Promise<{ id: string }>;
}

export type FieldError = { field: string; message: string };

export type CreateTicketResult =
    | { ok: true; ticketId: string }
    | { ok: false; errors: FieldError[] };

type Deps = { categories: CategoriesRepo; tickets: TicketsRepo };

export async function createTicket(
    input: unknown,
    createdBy: string,
    deps: Deps,
): Promise<CreateTicketResult> {
    // 1. Shape: is the input well-formed?
    const parsed = createTicketSchema.safeParse(input);
    if (!parsed.success) {
        return {
            ok: false,
            errors: parsed.error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message,
            })),
        };
    }

    // 2. Facts: does the category exist and is it active?
    const category = await deps.categories.findActiveById(parsed.data.categoryId);
    if (!category) {
        return {
            ok: false,
            errors: [{ field: "categoryId", message: "Unknown or inactive category" }],
        };
    }

    // 3. Write.
    const { id } = await deps.tickets.insert({ ...parsed.data, createdBy });
    return { ok: true, ticketId: id };
}