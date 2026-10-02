export function initialsAvatar(name: string, bg = "075E54"): string {
  const ini = name.split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128"><rect width="128" height="128" fill="#${bg}"/><text x="64" y="64" fill="#fff" font-family="sans-serif" font-size="52" text-anchor="middle" dominant-baseline="central">${ini}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
