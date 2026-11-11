"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import {
    allowedAttachmentTypes,
    attachmentFileSchema,
    MAX_ATTACHMENTS_PER_TICKET,
} from "@/lib/schemas/attachment";

type Picked = { id: string; file: File; previewUrl: string | null };

export function AttachmentPicker() {
    const inputRef = useRef<HTMLInputElement>(null);
    const pickedRef = useRef<Picked[]>([]);
    const urlsRef = useRef<string[]>([]);
    const [picked, setPicked] = useState<Picked[]>([]);
    const [error, setError] = useState<string>();
    const [dragging, setDragging] = useState(false);

    const commit = useCallback((next: Picked[]) => {
        pickedRef.current = next;
        setPicked(next);
    }, []);

    const addFiles = useCallback(
        (incoming: File[]) => {
            if (incoming.length === 0) return;

            const next = [...pickedRef.current];
            let firstError: string | undefined;

            for (const file of incoming) {
                if (next.length >= MAX_ATTACHMENTS_PER_TICKET) {
                    firstError ??= `You can attach up to ${MAX_ATTACHMENTS_PER_TICKET} files`;
                    break;
                }

                const result = attachmentFileSchema.safeParse(file);
                if (!result.success) {
                    firstError ??= result.error.issues[0]?.message;
                    continue;
                }

                const previewUrl = file.type.startsWith("image/") ? URL.createObjectURL(file) : null;
                if (previewUrl) urlsRef.current.push(previewUrl);

                next.push({ id: crypto.randomUUID(), file, previewUrl });
            }

            commit(next);
            setError(firstError);
        },
        [commit],
    );

    const removeFile = (id: string) => {
        const target = pickedRef.current.find((item) => item.id === id);
        if (target?.previewUrl) {
            URL.revokeObjectURL(target.previewUrl);
            urlsRef.current = urlsRef.current.filter((url) => url !== target.previewUrl);
        }
        commit(pickedRef.current.filter((item) => item.id !== id));
        setError(undefined);
    };

    // Keep the real <input type="file"> in sync, so the files travel with the form.
    useEffect(() => {
        if (!inputRef.current) return;
        const transfer = new DataTransfer();
        picked.forEach((item) => transfer.items.add(item.file));
        inputRef.current.files = transfer.files;
    }, [picked]);

    // Paste a screenshot (Win+Shift+S, then Ctrl+V) anywhere on the page.
    useEffect(() => {
        const onPaste = (event: ClipboardEvent) => {
            const files = Array.from(event.clipboardData?.files ?? []);
            if (files.length > 0) addFiles(files);
        };
        document.addEventListener("paste", onPaste);
        return () => document.removeEventListener("paste", onPaste);
    }, [addFiles]);

    // Free the temporary preview URLs when the component goes away.
    useEffect(() => {
        return () => urlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    }, []);

    return (
        <div className="flex flex-col gap-3">
            <span className="font-display text-xl uppercase">Attachments (optional)</span>

            <div
                onDragOver={(event) => {
                    event.preventDefault();
                    setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(event) => {
                    event.preventDefault();
                    setDragging(false);
                    addFiles(Array.from(event.dataTransfer.files));
                }}
                className={cn(
                    "flex flex-col items-center gap-3 rounded-xl border-4 border-dashed border-ink p-5 text-center",
                    dragging ? "bg-geek-yellow" : "bg-white",
                )}
            >
                <Button tone="blue" onClick={() => inputRef.current?.click()}>
                    📎 Attach screenshot
                </Button>
                <p className="text-sm font-medium">
                    or drop files here, or paste with Ctrl+V. Up to {MAX_ATTACHMENTS_PER_TICKET} files, 5 MB each.
                </p>

                <input
                    ref={inputRef}
                    type="file"
                    name="attachments"
                    multiple
                    accept={allowedAttachmentTypes.join(",")}
                    onChange={(event) => addFiles(Array.from(event.target.files ?? []))}
                    className="sr-only"
                    tabIndex={-1}
                    aria-hidden="true"
                />
            </div>

            {error && (
                <p role="alert" className="text-sm font-bold text-geek-red">
                    {error}
                </p>
            )}

            {picked.length > 0 && (
                <ul className="flex flex-wrap gap-4">
                    {picked.map((item) => (
                        <li
                            key={item.id}
                            className="relative h-24 w-24 rounded-xl border-4 border-ink bg-white shadow-brutal"
                        >
                            {item.previewUrl ? (
                                // A temporary blob: URL cannot go through next/image.
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={item.previewUrl}
                                    alt={`Preview of ${item.file.name}`}
                                    className="h-full w-full rounded-lg object-cover"
                                />
                            ) : (
                                <span className="flex h-full flex-col items-center justify-center gap-1 p-1 text-center text-xs font-bold">
                                    <span aria-hidden className="text-2xl">
                                        📄
                                    </span>
                                    <span className="line-clamp-2 break-all">{item.file.name}</span>
                                </span>
                            )}
                            <button
                                type="button"
                                onClick={() => removeFile(item.id)}
                                aria-label={`Remove ${item.file.name}`}
                                className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full border-[3px] border-ink bg-geek-red text-sm font-bold text-white active:translate-y-0.5"
                            >
                                ✕
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}