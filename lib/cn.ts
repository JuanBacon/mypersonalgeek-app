import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Joins class names, skips falsy values, and resolves Tailwind conflicts
// (for example, a later "p-6" wins over an earlier "p-4").
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}