import { ConvexError } from "convex/values";

export function assertAdmin(adminSecret: string | undefined) {
  const expected = process.env.BLOG_ADMIN_SECRET;
  if (!expected) {
    throw new ConvexError("Blog admin secret is not configured on the server.");
  }
  if (!adminSecret || adminSecret !== expected) {
    throw new ConvexError("Unauthorized");
  }
}
