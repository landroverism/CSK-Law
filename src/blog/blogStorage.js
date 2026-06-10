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
