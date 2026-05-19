const WORKSPACE_KEY = "csk_adv_blog_workspace_v1";
const LIVE_CACHE_KEY = "csk_adv_blog_live_cache_v1";
export const BLOG_UPDATED_EVENT = "csk-blog-updated";

/** @typedef {{ id: string, title: string, slug: string, excerpt: string, body: string, published: boolean, createdAt: string, updatedAt: string }} BlogPost */

export function slugify(text) {
  const s = String(text || "")
    .toLowerCase()
    .trim()
    .replace(/['']/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
  return s.replace(/^-|-$/g, "") || "post";
}

export function loadWorkspace() {
  try {
    const raw = localStorage.getItem(WORKSPACE_KEY);
    if (!raw) return { version: 1, posts: [] };
    const data = JSON.parse(raw);
    if (!data || !Array.isArray(data.posts)) return { version: 1, posts: [] };
    return data;
  } catch {
    return { version: 1, posts: [] };
  }
}

/** @param {{ version?: number, posts: BlogPost[] }} data */
export function saveWorkspace(data) {
  localStorage.setItem(WORKSPACE_KEY, JSON.stringify({ version: 1, posts: data.posts }));
}

function loadLiveCache() {
  try {
    const raw = localStorage.getItem(LIVE_CACHE_KEY);
    if (!raw) return { version: 1, posts: [] };
    const data = JSON.parse(raw);
    if (!data || !Array.isArray(data.posts)) return { version: 1, posts: [] };
    return data;
  } catch {
    return { version: 1, posts: [] };
  }
}

function stripForPublic(posts) {
  return posts
    .filter((p) => p.published)
    .map(({ published: _p, ...rest }) => rest);
}

/** Push published workspace posts into browser cache so /blog updates immediately. */
export function syncPublishedToLiveCache(workspace) {
  const posts = stripForPublic(workspace.posts);
  localStorage.setItem(LIVE_CACHE_KEY, JSON.stringify({ version: 1, posts }));
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(BLOG_UPDATED_EVENT));
  }
}

function mergePostsByNewest(postLists) {
  const byId = new Map();
  for (const list of postLists) {
    for (const p of list) {
      if (!p?.id) continue;
      const prev = byId.get(p.id);
      if (!prev || new Date(p.updatedAt || 0) >= new Date(prev.updatedAt || 0)) {
        byId.set(p.id, p);
      }
    }
  }
  return [...byId.values()].sort(
    (a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0)
  );
}

/** Published posts as deployed visitors see them (from /blog-data.json). */
export async function fetchLiveBundle() {
  try {
    const res = await fetch(`/blog-data.json?cb=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return { version: 1, posts: [] };
    const data = await res.json();
    if (!data || !Array.isArray(data.posts)) return { version: 1, posts: [] };
    return data;
  } catch {
    return { version: 1, posts: [] };
  }
}

/** All published posts: server file + this browser's published cache (newer wins per id). */
export async function fetchPublishedPosts() {
  const live = await fetchLiveBundle();
  const cache = loadLiveCache();
  const posts = mergePostsByNewest([live.posts, cache.posts]);
  return { version: 1, posts };
}

/** Merge live file into workspace by id (live wins on conflict for published snapshot). */
export function mergeLiveIntoWorkspace(workspace, live) {
  const byId = new Map(workspace.posts.map((p) => [p.id, { ...p }]));
  for (const p of live.posts) {
    if (!p.id) continue;
    const existing = byId.get(p.id);
    if (!existing) {
      byId.set(p.id, {
        ...p,
        published: true,
      });
    }
  }
  return { version: 1, posts: [...byId.values()] };
}

/** Build file to upload as public/blog-data.json on the server. */
export function bundleForLiveSite(workspace) {
  return JSON.stringify({ version: 1, posts: stripForPublic(workspace.posts) }, null, 2);
}

export function newPost() {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    title: "",
    slug: "",
    excerpt: "",
    body: "",
    published: false,
    createdAt: now,
    updatedAt: now,
  };
}
