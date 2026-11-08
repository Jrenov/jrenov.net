/**
 * Sitemap généré au build : inclut automatiquement les pages créées depuis
 * l'administration (plus besoin de le mettre à jour à la main).
 */
import type { APIRoute } from "astro";
import { services } from "../lib/services.ts";
import { pages } from "../lib/pages.ts";

const SITE = "https://jrenov.net";

export const GET: APIRoute = () => {
  const today = new Date().toISOString().slice(0, 10);
  const urls: { loc: string; priority: string }[] = [
    { loc: `${SITE}/`, priority: "1.0" },
    ...services.map((s) => ({ loc: `${SITE}/${s.slug}`, priority: "0.9" })),
    { loc: `${SITE}/renovation-vannes`, priority: "0.7" },
    ...pages.map((p) => ({ loc: `${SITE}/${p.url}`, priority: "0.6" })),
  ];
  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls
      .map(
        (u) =>
          `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`,
      )
      .join("\n") +
    `\n</urlset>\n`;
  return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
