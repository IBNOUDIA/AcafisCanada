interface IpCarrier {
  headers: Record<string, string | string[] | undefined>;
  socket?: { remoteAddress?: string | null };
}

// Works for both the Express dev server (server.ts) and Vercel's
// VercelRequest (api/*.ts) — both expose .headers and .socket the same way.
export function getClientIp(req: IpCarrier): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0].trim();
  }
  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return forwarded[0].trim();
  }
  return req.socket?.remoteAddress || "unknown";
}
