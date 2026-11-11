// The "physical button" behavior shared by buttons and clickable cards.
export const pressable = [
    "transition-[transform,box-shadow] duration-100 ease-out motion-reduce:transition-none",
    // Hover only exists on devices with a pointer, so touch screens skip it.
    "hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lg",
    // Press: move onto the shadow and remove it, so it looks pushed in.
    "active:translate-x-1 active:translate-y-1 active:shadow-none",
    "focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-ink",
].join(" ");