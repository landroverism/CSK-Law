import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { ConvexHttpClient } from "convex/browser";

const SITE_URL = "https://kipkemoi-advocates.org";
const DEFAULT_CONVEX_URL = "https://veracious-setter-259.convex.cloud";

function parseEnvFile(filename) {
  const vars = {};
  try {
    const raw = readFileSync(resolve(process.cwd(), filename), "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const idx = trimmed.indexOf("=");
      if (idx === -1) continue;
      vars[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim();
    }
  } catch {
    // optional for CI
  }
  return vars;
}

function isValidConvexUrl(url) {
  return typeof url === "string" && /^https?:\/\/.+\.convex\.(cloud|site)\/?$/i.test(url.trim());
}

function resolveConvexUrl() {
  const candidates = [
    process.env.VITE_CONVEX_URL,
    parseEnvFile(".env.production").VITE_CONVEX_URL,
    parseEnvFile(".env.local").VITE_CONVEX_URL,
    DEFAULT_CONVEX_URL,
  ];

  for (const candidate of candidates) {
    if (isValidConvexUrl(candidate)) return candidate.trim();
  }

  return null;
}

const convexUrl = resolveConvexUrl();
if (!convexUrl) {
  console.warn("No valid VITE_CONVEX_URL — writing minimal sitemap without blog posts.");
}

async function main() {
  let posts = [];
  if (convexUrl) {
    try {
      const client = new ConvexHttpClient(convexUrl);
      posts = await client.query("posts:listPublished", {});
    } catch (err) {
      console.warn("Could not fetch posts from Convex — writing minimal sitemap.", err?.message || err);
    }
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
