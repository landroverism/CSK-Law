import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { ConvexHttpClient } from "convex/browser";

const SITE_URL = "https://kipkemoiadvocates.org";

function loadEnv() {
  try {
    const raw = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const idx = trimmed.indexOf("=");
      if (idx === -1) continue;
      const key = trimmed.slice(0, idx).trim();
      const value = trimmed.slice(idx + 1).trim();
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // optional for CI
  }
}

loadEnv();

const convexUrl = process.env.VITE_CONVEX_URL;
if (!convexUrl) {
  console.warn("VITE_CONVEX_URL not set — writing minimal sitemap.");
}

async function main() {
  let posts = [];
  if (convexUrl) {
    const client = new ConvexHttpClient(convexUrl);
    posts = await client.query("posts:listPublished", {});
  }

  const urls = [
    { loc: `${SITE_URL}/`, changefreq: "monthly", priority: "1.0" },
    { loc: `${SITE_URL}/blog`, changefreq: "weekly", priority: "0.9" },
    ...posts.map((post) => ({
      loc: `${SITE_URL}/blog/${encodeURIComponent(post.slug)}`,
      changefreq: "monthly",
      priority: "0.8",
      lastmod: new Date(post.updatedAt).toISOString().slice(0, 10),
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ""}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

  const out = resolve(process.cwd(), "public/sitemap.xml");
  writeFileSync(out, xml, "utf8");
  console.log(`Wrote ${urls.length} URLs to public/sitemap.xml`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
