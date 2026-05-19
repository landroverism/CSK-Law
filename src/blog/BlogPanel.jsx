import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import {
  bundleForLiveSite,
  fetchLiveBundle,
  loadWorkspace,
  mergeLiveIntoWorkspace,
  newPost,
  saveWorkspace,
  slugify,
  syncPublishedToLiveCache,
} from "./blogStorage";

const NAVY = "#0B1B2E";
const GOLD = "#C8A96E";
const IVORY = "#FAFAF7";

function ensureUniqueSlug(posts, slug, excludeId) {
  let s = slug || "post";
  const taken = (x) => posts.some((p) => p.id !== excludeId && p.slug === x);
  if (!taken(s)) return s;
  let n = 2;
  while (taken(`${s}-${n}`)) n += 1;
  return `${s}-${n}`;
}

export default function BlogPanel() {
  const [workspace, setWorkspace] = useState(() => loadWorkspace());
  const [selectedId, setSelectedId] = useState(() => {
    const w = loadWorkspace();
    return w.posts[0]?.id ?? null;
  });
  const [toast, setToast] = useState("");
  const fileImportRef = useRef(null);

  useEffect(() => {
    syncPublishedToLiveCache(loadWorkspace());
  }, []);

  const selected = useMemo(
    () => workspace.posts.find((p) => p.id === selectedId) ?? null,
    [workspace.posts, selectedId]
  );

  const persist = useCallback((next) => {
    saveWorkspace(next);
    setWorkspace(next);
    syncPublishedToLiveCache(next);
  }, []);

  const updateSelected = useCallback(
    (patch) => {
      if (!selectedId) return;
      const now = new Date().toISOString();
      const nextPosts = workspace.posts.map((p) =>
        p.id === selectedId ? { ...p, ...patch, updatedAt: now } : p
      );
      const next = { version: 1, posts: nextPosts };
      saveWorkspace(next);
      setWorkspace(next);
      if (patch.published !== undefined || nextPosts.find((p) => p.id === selectedId)?.published) {
        syncPublishedToLiveCache(next);
      }
    },
    [selectedId, workspace.posts]
  );

  const addPost = () => {
    const p = newPost();
    const next = { version: 1, posts: [p, ...workspace.posts] };
    persist(next);
    setSelectedId(p.id);
  };

  const publishCurrent = () => {
    if (!selected) return;
    const slug = ensureUniqueSlug(
      workspace.posts,
      slugify(selected.slug || selected.title),
      selected.id
    );
    const title = selected.title?.trim() || "Untitled";
    const now = new Date().toISOString();
    const nextPosts = workspace.posts.map((p) =>
      p.id === selectedId ? { ...p, slug, title, published: true, updatedAt: now } : p
    );
    const next = { version: 1, posts: nextPosts };
    persist(next);
    setToast("Published — visible on the Blog page now. Download blog-data.json for all visitors on the live site.");
  };

  const unpublishCurrent = () => {
    if (!selected) return;
    const now = new Date().toISOString();
    const nextPosts = workspace.posts.map((p) =>
      p.id === selectedId ? { ...p, published: false, updatedAt: now } : p
    );
    persist({ version: 1, posts: nextPosts });
    setToast("Unpublished — removed from the public blog.");
  };

  const saveCurrent = () => {
    if (!selected) return;
    const slug = ensureUniqueSlug(workspace.posts, slugify(selected.slug || selected.title), selected.id);
    const title = selected.title?.trim() || "Untitled";
    updateSelected({ slug, title });
    setToast("Saved.");
  };

  const removeSelected = () => {
    if (!selectedId) return;
    if (!window.confirm("Delete this article from the workspace?")) return;
    const nextPosts = workspace.posts.filter((p) => p.id !== selectedId);
    persist({ version: 1, posts: nextPosts });
    setSelectedId(nextPosts[0]?.id ?? null);
  };

  const syncFromLive = async () => {
    const live = await fetchLiveBundle();
    const merged = mergeLiveIntoWorkspace(workspace, live);
    persist(merged);
    setToast("Merged posts from the live site file.");
  };

  const downloadLiveJson = () => {
    const blob = new Blob([bundleForLiveSite(workspace)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "blog-data.json";
    a.click();
    URL.revokeObjectURL(a.href);
    setToast("Downloaded blog-data.json — upload this to your hosting root so everyone sees your posts.");
  };

  const downloadWorkspaceJson = () => {
    const blob = new Blob([JSON.stringify(workspace, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "blog-workspace-backup.json";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const onImportFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (!data || !Array.isArray(data.posts)) {
        window.alert("Invalid file: expected { posts: [...] }");
        return;
      }
      persist({ version: 1, posts: data.posts });
      setSelectedId(data.posts[0]?.id ?? null);
      setToast("Workspace imported.");
    } catch {
      window.alert("Could not read JSON.");
    }
  };

  return (
    <Box sx={{ bgcolor: IVORY, minHeight: "100vh", pt: { xs: 14, md: 16 }, pb: { xs: 6, md: 10 } }}>
      <Container maxWidth="lg">
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} spacing={2} mb={3}>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: { xs: "1.5rem", md: "1.85rem" }, color: NAVY }}>
              Blog workspace
            </Typography>
            <Typography sx={{ color: "rgba(11,27,46,0.55)", fontSize: "0.85rem", mt: 0.5 }}>
              Write here, then{" "}
              <Box component="span" sx={{ fontWeight: 600 }}>
                Publish to blog
              </Box>
              . View on the public{" "}
              <Box component={RouterLink} to="/blog" sx={{ color: GOLD, fontWeight: 600 }}>
                Blog
              </Box>{" "}
              page.
            </Typography>
          </Box>
          <Button component={RouterLink} to="/#team" variant="outlined" sx={{ borderColor: NAVY, color: NAVY, flexShrink: 0 }}>
            Back to site
          </Button>
        </Stack>

        <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
          <strong>Publish to blog</strong> makes posts appear immediately in your browser. For all visitors on{" "}
          <strong>kipkemoiadvocates.org</strong>, also download <strong>blog-data.json</strong> and upload it next to{" "}
          <code>index.html</code> on your host.
        </Alert>

        <Stack direction={{ xs: "column", md: "row" }} spacing={3} alignItems="stretch">
          <Paper elevation={0} sx={{ width: { md: 280 }, flexShrink: 0, border: "1px solid rgba(11,27,46,0.1)", borderRadius: 2 }}>
            <Box sx={{ p: 2, borderBottom: "1px solid rgba(11,27,46,0.08)" }}>
              <Button fullWidth variant="contained" onClick={addPost} sx={{ bgcolor: NAVY, fontWeight: 700, mb: 1 }}>
                New article
              </Button>
              <Typography sx={{ fontSize: "0.7rem", color: "rgba(11,27,46,0.45)", textAlign: "center" }}>
                {workspace.posts.length} in workspace
              </Typography>
            </Box>
            <List dense sx={{ py: 0, maxHeight: { xs: 220, md: "calc(100vh - 280px)" }, overflow: "auto" }}>
              {workspace.posts.map((p) => (
                <ListItemButton key={p.id} selected={p.id === selectedId} onClick={() => setSelectedId(p.id)}>
                  <ListItemText
                    primary={p.title?.trim() || "Untitled"}
                    secondary={p.published ? "Published" : "Draft"}
                    primaryTypographyProps={{ sx: { fontWeight: 600, fontSize: "0.88rem", color: NAVY } }}
                    secondaryTypographyProps={{ sx: { fontSize: "0.68rem" } }}
                  />
                </ListItemButton>
              ))}
              {workspace.posts.length === 0 && (
                <Typography sx={{ p: 2, color: "rgba(11,27,46,0.45)", fontSize: "0.85rem" }}>No articles yet.</Typography>
              )}
            </List>
          </Paper>

          <Paper elevation={0} sx={{ flex: 1, border: "1px solid rgba(11,27,46,0.1)", borderRadius: 2, p: { xs: 2, md: 3 } }}>
            {!selected && (
              <Typography sx={{ color: "rgba(11,27,46,0.55)" }}>Select an article or create a new one.</Typography>
            )}
            {selected && (
              <Stack spacing={2.5}>
                <TextField
                  label="Title"
                  fullWidth
                  value={selected.title}
                  onChange={(e) => updateSelected({ title: e.target.value })}
                  onBlur={() => {
                    if (!selected.slug?.trim() && selected.title?.trim()) {
                      updateSelected({ slug: slugify(selected.title) });
                    }
                  }}
                />
                <TextField
                  label="URL slug"
                  fullWidth
                  helperText="Used in the address: /blog/your-slug — auto-filled from title if left empty on blur."
                  value={selected.slug}
                  onChange={(e) => updateSelected({ slug: e.target.value })}
                />
                <TextField
                  label="Excerpt"
                  fullWidth
                  multiline
                  minRows={2}
                  value={selected.excerpt}
                  onChange={(e) => updateSelected({ excerpt: e.target.value })}
                />
                <TextField
                  label="Body"
                  fullWidth
                  multiline
                  minRows={12}
                  value={selected.body}
                  onChange={(e) => updateSelected({ body: e.target.value })}
                  placeholder="Plain text or paragraphs. Line breaks are preserved."
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!!selected.published}
                      onChange={(e) => updateSelected({ published: e.target.checked })}
                      sx={{ color: GOLD, "&.Mui-checked": { color: GOLD } }}
                    />
                  }
                  label="Published (shown on public blog)"
                />
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} flexWrap="wrap" useFlexGap>
                  <Button variant="contained" onClick={publishCurrent} sx={{ bgcolor: GOLD, color: NAVY, fontWeight: 700 }}>
                    Publish to blog
                  </Button>
                  <Button variant="outlined" onClick={saveCurrent} sx={{ borderColor: NAVY, color: NAVY }}>
                    Save draft
                  </Button>
                  {selected.published && (
                    <Button variant="outlined" color="warning" onClick={unpublishCurrent}>
                      Unpublish
                    </Button>
                  )}
                  <Button color="error" variant="outlined" onClick={removeSelected}>
                    Delete
                  </Button>
                </Stack>
              </Stack>
            )}

            <Divider sx={{ my: 4 }} />

            <Typography sx={{ fontWeight: 700, color: NAVY, mb: 1.5 }}>Deploy to kipkemoiadvocates.org</Typography>
            <Typography sx={{ color: "rgba(11,27,46,0.65)", fontSize: "0.88rem", lineHeight: 1.75, mb: 2 }}>
              After publishing, download <strong>blog-data.json</strong> and upload it to your website root (same folder as{" "}
              <code>index.html</code>). Replace the existing file. Then rebuild/redeploy the site if you use git deploy.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} flexWrap="wrap" useFlexGap>
              <Button variant="contained" onClick={downloadLiveJson} sx={{ bgcolor: NAVY, color: "white", fontWeight: 700 }}>
                Download blog-data.json
              </Button>
              <Button variant="outlined" onClick={downloadWorkspaceJson} sx={{ borderColor: NAVY, color: NAVY }}>
                Backup workspace
              </Button>
              <Button variant="outlined" onClick={syncFromLive} sx={{ borderColor: NAVY, color: NAVY }}>
                Merge from live site
              </Button>
              <Button variant="outlined" onClick={() => fileImportRef.current?.click()} sx={{ borderColor: NAVY, color: NAVY }}>
                Import workspace
              </Button>
              <input ref={fileImportRef} type="file" accept="application/json,.json" hidden onChange={onImportFile} />
            </Stack>
          </Paper>
        </Stack>
      </Container>

      <Snackbar
        open={!!toast}
        autoHideDuration={6000}
        onClose={() => setToast("")}
        message={toast}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
}
