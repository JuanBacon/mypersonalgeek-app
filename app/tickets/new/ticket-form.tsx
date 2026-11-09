"use client";

import { useActionState } from "react";
import { createTicketAction, type CreateTicketState } from "./actions";
import type { CategoryOption } from "../../../lib/repositories/categories";

const inputClass = "rounded border border-gray-400 px-3 py-2";

export function TicketForm({ categories }: { categories: CategoryOption[] }) {
    const [state, formAction, pending] = useActionState<CreateTicketState, FormData>(
        createTicketAction,
        null,
    );

    const errorFor = (field: string) =>
        state?.errors.find((error) => error.field === field)?.message;

    return (
        <form action={formAction} className="flex w-full max-w-xl flex-col gap-4">
            <div className="flex flex-col gap-1">
                <label htmlFor="title" className="text-sm font-medium">
                    Title
                </label>
                <input
                    id="title"
                    name="title"
                    type="text"
                    required
                    maxLength={100}
                    defaultValue={state?.values.title}
                    aria-invalid={Boolean(errorFor("title"))}
                    aria-describedby="title-error"
                    className={inputClass}
                />
                <p id="title-error" className="text-sm text-red-600">
                    {errorFor("title")}
                </p>
            </div>

            <div className="flex flex-col gap-1">
                <label htmlFor="categoryId" className="text-sm font-medium">
                    Category
                </label>
                <select
                    id="categoryId"
                    name="categoryId"
                    required
                    defaultValue={state?.values.categoryId ?? ""}
                    aria-invalid={Boolean(errorFor("categoryId"))}
                    aria-describedby="categoryId-error"
                    className={inputClass}
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
                <p id="categoryId-error" className="text-sm text-red-600">
                    {errorFor("categoryId")}
                </p>
            </div>

            <div className="flex flex-col gap-1">
                <label htmlFor="priority" className="text-sm font-medium">
                    Priority
                </label>
                <select
                    id="priority"
                    name="priority"
                    defaultValue={state?.values.priority || "normal"}
                    className={inputClass}
                >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                </select>
                <p className="text-sm text-red-600">{errorFor("priority")}</p>
            </div>

            <div className="flex flex-col gap-1">
                <label htmlFor="description" className="text-sm font-medium">
                    What is happening?
                </label>
                <textarea
                    id="description"
                    name="description"
                    required
                    rows={6}
                    maxLength={5000}
                    defaultValue={state?.values.description}
                    aria-invalid={Boolean(errorFor("description"))}
                    aria-describedby="description-hint description-error"
                    className={inputClass}
                />
                <p id="description-hint" className="text-sm text-gray-600">
                    Never write passwords or recovery codes here.
                </p>
                <p id="description-error" className="text-sm text-red-600">
                    {errorFor("description")}
                </p>
            </div>

            <button
                type="submit"
                disabled={pending}
                className="self-start rounded bg-black px-4 py-2 text-white disabled:opacity-50"
            >
                {pending ? "Sending..." : "Create ticket"}
            </button>
        </form>
    );
}