export type Tone = "white" | "yellow" | "blue" | "green" | "red" | "pink";

// Background and text colors, chosen as pairs so text stays readable.
export const toneClasses: Record<Tone, string> = {
  white: "bg-white text-ink",
  yellow: "bg-geek-yellow text-ink",
  blue: "bg-geek-blue text-white",
  green: "bg-geek-green text-ink",
  red: "bg-geek-red text-white",
  pink: "bg-geek-pink text-ink",
};