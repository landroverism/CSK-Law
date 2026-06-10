import { v } from "convex/values";
import type { MutationCtx } from "./_generated/server";
import { mutation, query } from "./_generated/server";
import { assertAdmin } from "./lib/auth";

const postFields = {
  title: v.string(),
  slug: v.string(),
  excerpt: v.string(),
  body: v.string(),
  published: v.boolean(),
  createdAt: v.number(),
  updatedAt: v.number(),
};

function slugify(text: string) {
  const s = String(text || "")
    .toLowerCase()
    .trim()
    .replace(/['']/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
  return s.replace(/^-|-$/g, "") || "post";
}

async function ensureUniqueSlug(ctx: MutationCtx, slug: string, excludeId?: string) {
  let candidate = slug || "post";
  const taken = async (s: string) => {
    const existing = await ctx.db
      .query("posts")
      .withIndex("by_slug", (q) => q.eq("slug", s))
      .unique();
    return existing && existing._id !== excludeId;
  };

  if (!(await taken(candidate))) return candidate;

  let n = 2;
  while (await taken(`${candidate}-${n}`)) n += 1;
  return `${candidate}-${n}`;
}

export const listPublished = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_published_updated", (q) => q.eq("published", true))
      .order("desc")
      .collect();

    return posts.map(({ _id, ...rest }) => ({ id: _id, ...rest }));
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const post = await ctx.db
      .query("posts")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();

    if (!post || !post.published) return null;
    const { _id, ...rest } = post;
    return { id: _id, ...rest };
  },
});

export const listAll = query({
  args: { adminSecret: v.string() },
  handler: async (ctx, { adminSecret }) => {
    assertAdmin(adminSecret);
    const posts = await ctx.db.query("posts").collect();
    return posts
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .map(({ _id, ...rest }) => ({ id: _id, ...rest }));
  },
});

export const verifyAdmin = mutation({
  args: { adminSecret: v.string() },
  handler: async (_ctx, { adminSecret }) => {
    try {
      assertAdmin(adminSecret);
      return { ok: true as const };
    } catch {
      return { ok: false as const };
    }
  },
});

export const create = mutation({
  args: {
    adminSecret: v.string(),
    title: v.optional(v.string()),
  },
  handler: async (ctx, { adminSecret, title }) => {
    assertAdmin(adminSecret);
    const now = Date.now();
    const baseTitle = title?.trim() || "";
    const slug = await ensureUniqueSlug(ctx, slugify(baseTitle || "post"));
    const id = await ctx.db.insert("posts", {
      title: baseTitle,
      slug,
      excerpt: "",
      body: "",
      published: false,
      createdAt: now,
      updatedAt: now,
    });
    return id;
  },
});

export const save = mutation({
  args: {
    adminSecret: v.string(),
    id: v.id("posts"),
    title: v.string(),
    slug: v.string(),
    excerpt: v.string(),
    body: v.string(),
    published: v.boolean(),
  },
  handler: async (ctx, args) => {
    assertAdmin(args.adminSecret);
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Post not found");

    const title = args.title.trim() || "Untitled";
    const slug = await ensureUniqueSlug(ctx, slugify(args.slug || title), args.id);
    const now = Date.now();

    await ctx.db.patch(args.id, {
      title,
      slug,
      excerpt: args.excerpt,
      body: args.body,
      published: args.published,
      updatedAt: now,
    });

    return { id: args.id, slug };
  },
});

export const publish = mutation({
  args: {
    adminSecret: v.string(),
    id: v.id("posts"),
    title: v.string(),
    slug: v.string(),
    excerpt: v.string(),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    assertAdmin(args.adminSecret);
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Post not found");

    const title = args.title.trim() || "Untitled";
    const slug = await ensureUniqueSlug(ctx, slugify(args.slug || title), args.id);
    const now = Date.now();

    await ctx.db.patch(args.id, {
      title,
      slug,
      excerpt: args.excerpt,
      body: args.body,
      published: true,
      updatedAt: now,
    });

    return { id: args.id, slug };
  },
});

export const unpublish = mutation({
  args: {
    adminSecret: v.string(),
    id: v.id("posts"),
  },
  handler: async (ctx, { adminSecret, id }) => {
    assertAdmin(adminSecret);
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Post not found");
    await ctx.db.patch(id, { published: false, updatedAt: Date.now() });
  },
});

export const remove = mutation({
  args: {
    adminSecret: v.string(),
    id: v.id("posts"),
  },
  handler: async (ctx, { adminSecret, id }) => {
    assertAdmin(adminSecret);
    await ctx.db.delete(id);
  },
});

export const importFromJson = mutation({
  args: {
    adminSecret: v.string(),
    posts: v.array(v.object(postFields)),
  },
  handler: async (ctx, { adminSecret, posts }) => {
    assertAdmin(adminSecret);
    let count = 0;
    for (const post of posts) {
      const slug = await ensureUniqueSlug(ctx, post.slug || slugify(post.title));
      await ctx.db.insert("posts", {
        title: post.title,
        slug,
        excerpt: post.excerpt,
        body: post.body,
        published: post.published,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      });
      count += 1;
    }
    return { imported: count };
  },
});
