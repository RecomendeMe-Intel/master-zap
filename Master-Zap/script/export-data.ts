import { writeFileSync, mkdirSync } from "fs";
import { storage } from "../server/storage";

const out = "client/public/data";
mkdirSync(out, { recursive: true });
const contacts = await storage.getContacts();
writeFileSync(`${out}/contacts.json`, JSON.stringify(contacts));
writeFileSync(`${out}/citations.json`, JSON.stringify(await storage.getCitations()));
for (const c of contacts) {
  writeFileSync(`${out}/messages-${c.id}.json`, JSON.stringify(await storage.getMessages(c.id)));
}
console.log(`exported ${contacts.length} contacts`);
