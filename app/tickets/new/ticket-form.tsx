"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Field, inputStyles } from "@/components/ui/field";
import { AttachmentPicker } from "@/components/tickets/attachment-picker";
import { PriorityPicker } from "@/components/tickets/priority-picker";
import { attachmentsEnabled } from "@/lib/features";
import type { CategoryOption } from "@/lib/repositories/categories";
import { createTicketAction, type CreateTicketState } from "./actions";

export function TicketForm({ categories }: { categories: CategoryOption[] }) {
    const [state, formAction, pending] = useActionState<CreateTicketState, FormData>(
        createTicketAction,
        null,
    );

    const errorFor = (field: string) =>
        state?.errors.find((error) => error.field === field)?.message;

    return (
        <form action={formAction} className="flex flex-col gap-5">
            <Field id="title" label="Short title" error={errorFor("title")}>
                <input
                    id="title"
                    name="title"
                    type="text"
                    required
                    maxLength={100}
                    placeholder="Screen flickering"
                    defaultValue={state?.values.title}
                    aria-invalid={Boolean(errorFor("title"))}
                    aria-describedby="title-error"
                    className={inputStyles}
                />
            </Field>

            <Field id="categoryId" label="What kind of problem?" error={errorFor("categoryId")}>
                <select
                    id="categoryId"
                    name="categoryId"
                    required
                    defaultValue={state?.values.categoryId ?? ""}
                    aria-invalid={Boolean(errorFor("categoryId"))}
                    aria-describedby="categoryId-error"
                    className={inputStyles}
                >
                    <option value="" disabled>
                        Choose a category
                    </option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.label}
                        </option>
                    ))}
                </select>
            </Field>

            <Field
                id="description"
                label="What's going wrong?"
                hint="Never write passwords or recovery codes here."
                error={errorFor("description")}
            >
                <textarea
                    id="description"
                    name="description"
                    required
                    rows={6}
                    maxLength={5000}
                    placeholder="My screen is flickering again..."
                    defaultValue={state?.values.description}
                    aria-invalid={Boolean(errorFor("description"))}
                    aria-describedby="description-hint description-error"
                    className={inputStyles}
                />
            </Field>

            {attachmentsEnabled && <AttachmentPicker />}

            <PriorityPicker defaultValue={state?.values.priority || "normal"} />
            {errorFor("priority") && (
                <p role="alert" className="text-sm font-bold text-geek-red">
                    {errorFor("priority")}
                </p>
            )}

            <Button type="submit" size="lg" tone="pink" fullWidth disabled={pending}>
                {pending ? "Sending..." : "Send to my geek!"}
            </Button>
        </form>
    );
}