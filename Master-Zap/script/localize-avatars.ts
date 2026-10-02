// Downloads every remote avatar into client/public/avatars and rewrites
// contacts.json so the app never needs the network. Failed downloads get a
// locally generated initials SVG.
import { readFileSync, writeFileSync, mkdirSync } from "fs";

const dir = "client/public/avatars";
mkdirSync(dir, { recursive: true });
const file = "client/public/data/contacts.json";
const contacts = JSON.parse(readFileSync(file, "utf8"));

const initialsSvg = (name: string) => {
  const ini = name.split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128"><rect width="128" height="128" fill="#075E54"/><text x="64" y="64" fill="#fff" font-family="sans-serif" font-size="52" text-anchor="middle" dominant-baseline="central">${ini}</text></svg>`;
};

for (const c of contacts) {
  const base = `${dir}/${c.id}`;
  let ext = "svg", body: Buffer | string = initialsSvg(c.name);
  try {
    const res = await fetch(c.avatar, { headers: { "User-Agent": "Mozilla/5.0" } });
    const type = res.headers.get("content-type") ?? "";
    if (!res.ok || !type.startsWith("image/")) throw new Error(`${res.status} ${type}`);
    ext = type.includes("svg") ? "svg" : type.includes("png") ? "png" : type.includes("webp") ? "webp" : "jpg";
    body = Buffer.from(await res.arrayBuffer());
  } catch (e) {
    console.warn(`fallback for ${c.name}: ${(e as Error).message}`);
  }
  writeFileSync(`${base}.${ext}`, body);
  c.avatar = `avatars/${c.id}.${ext}`;
}
writeFileSync(file, JSON.stringify(contacts));
