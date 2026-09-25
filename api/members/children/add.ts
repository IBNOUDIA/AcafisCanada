import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleMemberChildAdd } from "../../../src/server/handlers.js";
import { getClientIp } from "../../../src/server/requestIp.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  const result = await handleMemberChildAdd(req.body || {}, getClientIp(req));
  res.status(result.status).json(result.body);
}
