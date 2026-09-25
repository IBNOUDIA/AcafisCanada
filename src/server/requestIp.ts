interface IpCarrier {
  headers: Record<string, string | string[] | undefined>;
  socket?: { remoteAddress?: string | null };
}

// Works for both the Express dev server (server.ts) and Vercel's
// VercelRequest (api/*.ts) — both expose .headers and .socket the same way.
// x-forwarded-for is checked first (standard, and what Vercel's edge sets),
// x-real-ip as a fallback some proxies use instead, then the raw socket —
// observed in practice to occasionally be 127.0.0.1 on a cold serverless
// invocation before falling back correctly on subsequent warm requests.
export function getClientIp(req: IpCarrier): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0].trim();
  }
  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return forwarded[0].trim();
  }

  const realIp = req.headers["x-real-ip"];
  if (typeof realIp === "string" && realIp.length > 0) {
    return realIp.trim();
  }

  return req.socket?.remoteAddress || "unknown";
}
