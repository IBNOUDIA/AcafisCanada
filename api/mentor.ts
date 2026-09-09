import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleMentorRequest } from "../src/server/handlers";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  const result = await handleMentorRequest(req.body || {});
  res.status(result.status).json(result.body);
}
