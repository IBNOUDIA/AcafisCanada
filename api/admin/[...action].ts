import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  handleAdminLogin,
  handleAdminChangePassword,
  handleAdminMembersList,
  handleAdminSetPaymentStatus,
  handleAdminFamilyStats,
  handleAdminDocumentsList,
  handleAdminDocumentAdd,
  handleAdminDocumentRemove,
} from "../../src/server/adminHandlers.js";
import { getClientIp } from "../../src/server/requestIp.js";

// A single catch-all function for every /api/admin/* route — the Vercel
// Hobby plan caps a deployment at 12 serverless functions, and this project
// already has several other endpoints, so admin actions are dispatched here
// by path instead of getting one file each. Frontend URLs are unaffected
// (e.g. /api/admin/members/list still works exactly as before).
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  const action = Array.isArray(req.query.action) ? req.query.action.join("/") : req.query.action;
  const body = req.body || {};

  switch (action) {
    case "login": {
      const result = await handleAdminLogin(body, getClientIp(req));
      res.status(result.status).json(result.body);
      return;
    }
    case "change-password": {
      const result = await handleAdminChangePassword(body);
      res.status(result.status).json(result.body);
      return;
    }
    case "family-stats": {
      const result = await handleAdminFamilyStats(body);
      res.status(result.status).json(result.body);
      return;
    }
    case "members/list": {
      const result = await handleAdminMembersList(body);
      res.status(result.status).json(result.body);
      return;
    }
    case "members/set-payment-status": {
      const result = await handleAdminSetPaymentStatus(body);
      res.status(result.status).json(result.body);
      return;
    }
    case "documents/list": {
      const result = await handleAdminDocumentsList(body);
      res.status(result.status).json(result.body);
      return;
    }
    case "documents/add": {
      const result = await handleAdminDocumentAdd(body);
      res.status(result.status).json(result.body);
      return;
    }
    case "documents/remove": {
      const result = await handleAdminDocumentRemove(body);
      res.status(result.status).json(result.body);
      return;
    }
    default:
      res.status(404).json({ error: "Not Found" });
  }
}
