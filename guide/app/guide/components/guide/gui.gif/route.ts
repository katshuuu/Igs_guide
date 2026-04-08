import { readFile } from "node:fs/promises";
import path from "node:path";

export async function GET() {
  const gifPath = path.join(process.cwd(), "components", "guide", "gui.gif");
  const gif = await readFile(gifPath);

  return new Response(gif, {
    headers: {
      "content-type": "image/gif",
      "cache-control": "public, max-age=3600",
    },
  });
}
