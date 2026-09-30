import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  handleMemberSurveysList,
  handleMemberSurveySubmit,
  handleMemberSurveyResults,
} from "../../../src/server/surveyHandlers.js";
import { getClientIp } from "../../../src/server/requestIp.js";

// One catch-all function for /api/members/surveys/* — see api/admin/[...action].ts
// for why (Vercel Hobby plan's 12-function-per-deployment cap).
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  // Parsed straight from the raw URL rather than req.query's dynamic-segment
  // population, which proved unreliable for nested catch-all paths here.
  const path = (req.url || "").split("?")[0];
  const prefix = "/api/members/surveys/";
  const action = path.startsWith(prefix) ? path.slice(prefix.length).replace(/\/+$/, "") : "";
  const body = req.body || {};
  const ip = getClientIp(req);

  switch (action) {
    case "list": {
      const result = await handleMemberSurveysList(body, ip);
      res.status(result.status).json(result.body);
      return;
    }
    case "submit": {
      const result = await handleMemberSurveySubmit(body, ip);
      res.status(result.status).json(result.body);
      return;
    }
    case "results": {
      const result = await handleMemberSurveyResults(body, ip);
      res.status(result.status).json(result.body);
      return;
    }
    default:
      res.status(404).json({ error: "Not Found" });
  }
}
