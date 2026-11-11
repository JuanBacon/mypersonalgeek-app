import { mkdir, readFile } from "node:fs/promises";
import sharp from "sharp";

const svg = await readFile("public/icons/icon.svg");
await mkdir("public/icons", { recursive: true });

// Standard icons.
await sharp(svg).resize(192, 192).png().toFile("public/icons/icon-192.png");
await sharp(svg).resize(512, 512).png().toFile("public/icons/icon-512.png");
await sharp(svg).resize(180, 180).png().toFile("public/icons/apple-touch-icon.png");

// Maskable icon: Android may crop it to a circle or a squircle, so the artwork
// must stay inside the central "safe zone". We shrink it to 70% on a solid background.
const inner = await sharp(svg).resize(358, 358).png().toBuffer();
await sharp({
    create: { width: 512, height: 512, channels: 4, background: "#FFC933" },
})
    .composite([{ input: inner, gravity: "center" }])
    .png()
    .toFile("public/icons/maskable-512.png");

console.log("Icons generated in public/icons");