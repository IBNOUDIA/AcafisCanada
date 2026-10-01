// Regenerates public/sitemap.xml from the site's real routes, run as part of
// the build (see vercel.json's buildCommand and package.json's build script)
// so it can never drift out of sync with src/routes.ts.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PAGE_ROUTES, SITE_ORIGIN } from "../src/routes";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Public-facing pages that exist outside PAGE_ROUTES (not in the main nav,
// but still meant to be indexed). Keep in sync by hand — there are few of
// these and they change rarely.
const EXTRA_PUBLIC_PATHS = ["/politique-confidentialite", "/mentions-legales", "/espace-membre"];

const allPaths = [...PAGE_ROUTES.map((r) => r.path), ...EXTRA_PUBLIC_PATHS];

function urlEntry(frPath: string): string {
  const frUrl = `${SITE_ORIGIN}${frPath === "/" ? "/" : frPath}`;
  const enUrl = `${SITE_ORIGIN}${frPath === "/" ? "/en" : `/en${frPath}`}`;
  return `  <url>
    <loc>${frUrl}</loc>
    <xhtml:link rel="alternate" hreflang="fr" href="${frUrl}" />
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${frUrl}" />
  </url>
  <url>
    <loc>${enUrl}</loc>
    <xhtml:link rel="alternate" hreflang="fr" href="${frUrl}" />
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${frUrl}" />
  </url>`;
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${allPaths.map(urlEntry).join("\n")}
</urlset>
`;

const outPath = path.join(__dirname, "..", "public", "sitemap.xml");
fs.writeFileSync(outPath, xml);
console.log(`sitemap.xml written with ${allPaths.length * 2} URLs -> ${outPath}`);
