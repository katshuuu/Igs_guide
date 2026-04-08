import { readFile } from "node:fs/promises";
import path from "node:path";

export async function GET() {
  const headerPath = path.join(process.cwd(), "header.html");
  const html = await readFile(headerPath, "utf-8");

  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
    },
  });
}
