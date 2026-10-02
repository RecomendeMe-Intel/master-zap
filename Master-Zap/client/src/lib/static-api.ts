// In the Android build there is no Express server: /api/* requests are
// answered from the JSON files exported by script/export-data.ts.
export function installStaticApi() {
  const realFetch = window.fetch.bind(window);
  const map = (url: string): string | null => {
    let m: RegExpMatchArray | null;
    if (url === "/api/contacts") return "data/contacts.json";
    if (url === "/api/citations") return "data/citations.json";
    if ((m = url.match(/^\/api\/contacts\/(\d+)\/messages$/))) return `data/messages-${m[1]}.json`;
    if ((m = url.match(/^\/api\/contacts\/(\d+)$/))) return `data/contacts.json#${m[1]}`;
    return null;
  };
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.pathname : input.url;
    const target = map(url);
    if (!target) return realFetch(input, init);
    const [file, id] = target.split("#");
    const res = await realFetch(file);
    if (!id) return res;
    const item = (await res.json()).find((c: { id: number }) => c.id === Number(id));
    return item
      ? new Response(JSON.stringify(item), { status: 200 })
      : new Response(JSON.stringify({ message: "Contato não encontrado" }), { status: 404 });
  };
}
