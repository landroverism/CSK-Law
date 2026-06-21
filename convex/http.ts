import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

const SITE_URL = "https://kipkemoi-advocates.org";

http.route({
  path: "/sitemap.xml",
  method: "GET",
  handler: httpAction(async (ctx) => {
    const posts = await ctx.runQuery(api.posts.listPublished);
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

    const body = `<?xml version="1.0" encoding="UTF-8"?>
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
</urlset>`;

    return new Response(body, {
      headers: { "Content-Type": "application/xml; charset=utf-8" },
    });
  }),
});

export default http;
