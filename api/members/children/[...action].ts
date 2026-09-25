import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  handleMemberChildrenList,
  handleMemberChildAdd,
  handleMemberChildRemove,
} from "../../../src/server/handlers.js";
import { getClientIp } from "../../../src/server/requestIp.js";

// One catch-all function for /api/members/children/* — see api/admin/[...action].ts
// for why (Vercel Hobby plan's 12-function-per-deployment cap). Frontend URLs
// (/api/members/children/list, /add, /remove) are unchanged.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  // Parsed straight from the raw URL rather than req.query's dynamic-segment
  // population, which proved unreliable for nested catch-all paths here.
  const path = (req.url || "").split("?")[0];
  const prefix = "/api/members/children/";
  const action = path.startsWith(prefix) ? path.slice(prefix.length).replace(/\/+$/, "") : "";
  const body = req.body || {};
  const ip = getClientIp(req);

  switch (action) {
    case "list": {
      const result = await handleMemberChildrenList(body, ip);
      res.status(result.status).json(result.body);
      return;
    }
    case "add": {
      const result = await handleMemberChildAdd(body, ip);
      res.status(result.status).json(result.body);
      return;
    }
    case "remove": {
      const result = await handleMemberChildRemove(body, ip);
      res.status(result.status).json(result.body);
      return;
    }
    default:
      res.status(404).json({ error: "Not Found" });
  }
}
