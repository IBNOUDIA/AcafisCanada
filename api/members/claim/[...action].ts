import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleMemberClaimInfo, handleMemberClaim } from "../../../src/server/handlers.js";

// One catch-all function for /api/members/claim/* — see api/admin/[...action].ts
// for why (Vercel Hobby plan's 12-function-per-deployment cap). Frontend URLs
// (/api/members/claim/info, /confirm) are unchanged.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  const path = (req.url || "").split("?")[0];
  const prefix = "/api/members/claim/";
  const action = path.startsWith(prefix) ? path.slice(prefix.length).replace(/\/+$/, "") : "";
  const body = req.body || {};

  switch (action) {
    case "info": {
      const result = await handleMemberClaimInfo(body);
      res.status(result.status).json(result.body);
      return;
    }
    case "confirm": {
      const result = await handleMemberClaim(body);
      res.status(result.status).json(result.body);
      return;
    }
    default:
      res.status(404).json({ error: "Not Found" });
  }
}
