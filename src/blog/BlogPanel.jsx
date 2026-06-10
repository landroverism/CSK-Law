import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
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
import { api } from "../../convex/_generated/api";
import { slugify } from "./blogStorage";
import { useBlogAdmin } from "./useBlogAdmin";

const NAVY = "#0B1B2E";
const GOLD = "#C8A96E";
const IVORY = "#FAFAF7";

function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);
  const verifyAdmin = useMutation(api.posts.verifyAdmin);

  const submit = async (e) => {
    e.preventDefault();
    setChecking(true);
    setError("");
    try {
      const result = await verifyAdmin({ adminSecret: password });
      if (result.ok) onLogin(password);
      else setError("Incorrect password.");
    } catch {
      setError("Could not sign in. Try again.");
    } finally {
      setChecking(false);
    }
  };

  return (
    <Box sx={{ bgcolor: IVORY, minHeight: "100vh", pt: { xs: 14, md: 16 }, pb: 8 }}>
      <Container maxWidth="sm">
        <Paper elevation={0} sx={{ p: 4, border: "1px solid rgba(11,27,46,0.1)", borderRadius: 2 }}>
          <Typography sx={{ fontWeight: 800, fontSize: "1.5rem", color: NAVY, mb: 1 }}>
            Blog admin
          </Typography>
          <Typography sx={{ color: "rgba(11,27,46,0.6)", mb: 3, lineHeight: 1.7 }}>
            Sign in to write and publish articles. Posts go live instantly for all visitors.
          </Typography>
          <Box component="form" onSubmit={submit}>
            <TextField
              label="Admin password"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 2 }}
            />
            {error ? (
              <Typography sx={{ color: "error.main", fontSize: "0.85rem", mb: 2 }}>{error}</Typography>
            ) : null}
            <Button type="submit" variant="contained" fullWidth disabled={checking} sx={{ bgcolor: NAVY, fontWeight: 700 }}>
              {checking ? "Signing in…" : "Sign in"}
            </Button>
          </Box>
          <Button component={RouterLink} to="/" sx={{ mt: 2, color: GOLD }}>
            Back to site
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}

export default function BlogPanel() {
  const { adminSecret, setAdminSecret, clearAdminSecret, isLoggedIn } = useBlogAdmin();
  const posts = useQuery(api.posts.listAll, isLoggedIn ? { adminSecret } : "skip");
  const createPost = useMutation(api.posts.create);
  const savePost = useMutation(api.posts.save);
  const publishPost = useMutation(api.posts.publish);
  const unpublishPost = useMutation(api.posts.unpublish);
  const removePost = useMutation(api.posts.remove);
  const importFromJson = useMutation(api.posts.importFromJson);

  const [selectedId, setSelectedId] = useState(null);
  const [draft, setDraft] = useState(null);
  const [toast, setToast] = useState("");
  const [busy, setBusy] = useState(false);
  const fileImportRef = useRef(null);

  const selected = useMemo(
    () => posts?.find((p) => p.id === selectedId) ?? null,
    [posts, selectedId]
  );

  useEffect(() => {
    if (!selected) {
      setDraft(null);
      return;
    }
    setDraft({
      title: selected.title,
      slug: selected.slug,
      excerpt: selected.excerpt,
      body: selected.body,
      published: selected.published,
    });
  }, [selected]);

  useEffect(() => {
    if (posts && posts.length > 0 && !selectedId) {
      setSelectedId(posts[0].id);
    }
  }, [posts, selectedId]);

  const updateDraft = useCallback((patch) => {
    setDraft((prev) => (prev ? { ...prev, ...patch } : prev));
  }, []);

  if (!isLoggedIn) {
    return <AdminLogin onLogin={setAdminSecret} />;
  }

  if (posts === undefined) {
    return (
      <Box sx={{ bgcolor: IVORY, minHeight: "100vh", pt: 20, textAlign: "center" }}>
        <Typography sx={{ color: "rgba(11,27,46,0.5)" }}>Loading workspace…</Typography>
      </Box>
    );
  }

  const addPost = async () => {
    setBusy(true);
    try {
      const id = await createPost({ adminSecret });
      setSelectedId(id);
      setToast("New article created.");
    } catch (err) {
      setToast(err?.message || "Could not create article.");
    } finally {
      setBusy(false);
    }
  };

  const saveCurrent = async () => {
    if (!selected || !draft) return;
    setBusy(true);
    try {
      const slug = draft.slug?.trim() || slugify(draft.title);
      const result = await savePost({
        adminSecret,
        id: selected.id,
        title: draft.title,
        slug,
        excerpt: draft.excerpt,
        body: draft.body,
        published: draft.published,
      });
      if (result.slug !== draft.slug) updateDraft({ slug: result.slug });
      setToast("Saved.");
    } catch (err) {
      setToast(err?.message || "Could not save.");
    } finally {
      setBusy(false);
    }
  };

  const publishCurrent = async () => {
    if (!selected || !draft) return;
    setBusy(true);
    try {
      const slug = draft.slug?.trim() || slugify(draft.title);
      const result = await publishPost({
        adminSecret,
        id: selected.id,
        title: draft.title,
        slug,
        excerpt: draft.excerpt,
        body: draft.body,
      });
      updateDraft({ slug: result.slug, published: true });
      setToast("Published — live for all visitors on kipkemoiadvocates.org.");
    } catch (err) {
      setToast(err?.message || "Could not publish.");
    } finally {
      setBusy(false);
    }
  };

  const unpublishCurrent = async () => {
    if (!selected) return;
    setBusy(true);
    try {
      await unpublishPost({ adminSecret, id: selected.id });
      updateDraft({ published: false });
      setToast("Unpublished — removed from the public blog.");
    } catch (err) {
      setToast(err?.message || "Could not unpublish.");
    } finally {
      setBusy(false);
    }
  };

  const removeSelected = async () => {
    if (!selectedId) return;
    if (!window.confirm("Delete this article permanently?")) return;
    setBusy(true);
    try {
      await removePost({ adminSecret, id: selectedId });
      const remaining = posts.filter((p) => p.id !== selectedId);
      setSelectedId(remaining[0]?.id ?? null);
      setToast("Article deleted.");
    } catch (err) {
      setToast(err?.message || "Could not delete.");
    } finally {
      setBusy(false);
    }
  };

  const onImportFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const rawPosts = data.posts || data;
      if (!Array.isArray(rawPosts)) {
        window.alert("Invalid file: expected { posts: [...] }");
        return;
      }
      const normalized = rawPosts.map((p) => ({
        title: p.title || "",
        slug: p.slug || slugify(p.title),
        excerpt: p.excerpt || "",
        body: p.body || "",
        published: !!p.published,
        createdAt: p.createdAt ? new Date(p.createdAt).getTime() : Date.now(),
        updatedAt: p.updatedAt ? new Date(p.updatedAt).getTime() : Date.now(),
      }));
      const result = await importFromJson({ adminSecret, posts: normalized });
      setToast(`Imported ${result.imported} article(s).`);
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
          <Stack direction="row" spacing={1}>
            <Button component={RouterLink} to="/#team" variant="outlined" sx={{ borderColor: NAVY, color: NAVY, flexShrink: 0 }}>
              Back to site
            </Button>
            <Button variant="text" onClick={clearAdminSecret} sx={{ color: "rgba(11,27,46,0.55)" }}>
              Sign out
            </Button>
          </Stack>
        </Stack>

        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
          <strong>Convex connected.</strong> Publishing updates the live site instantly — no manual file upload needed.
        </Alert>

        <Stack direction={{ xs: "column", md: "row" }} spacing={3} alignItems="stretch">
          <Paper elevation={0} sx={{ width: { md: 280 }, flexShrink: 0, border: "1px solid rgba(11,27,46,0.1)", borderRadius: 2 }}>
            <Box sx={{ p: 2, borderBottom: "1px solid rgba(11,27,46,0.08)" }}>
              <Button fullWidth variant="contained" onClick={addPost} disabled={busy} sx={{ bgcolor: NAVY, fontWeight: 700, mb: 1 }}>
                New article
              </Button>
              <Typography sx={{ fontSize: "0.7rem", color: "rgba(11,27,46,0.45)", textAlign: "center" }}>
                {posts.length} article{posts.length === 1 ? "" : "s"}
              </Typography>
            </Box>
            <List dense sx={{ py: 0, maxHeight: { xs: 220, md: "calc(100vh - 280px)" }, overflow: "auto" }}>
              {posts.map((p) => (
                <ListItemButton key={p.id} selected={p.id === selectedId} onClick={() => setSelectedId(p.id)}>
                  <ListItemText
                    primary={p.title?.trim() || "Untitled"}
                    secondary={p.published ? "Published" : "Draft"}
                    primaryTypographyProps={{ sx: { fontWeight: 600, fontSize: "0.88rem", color: NAVY } }}
                    secondaryTypographyProps={{ sx: { fontSize: "0.68rem" } }}
                  />
                </ListItemButton>
              ))}
              {posts.length === 0 && (
                <Typography sx={{ p: 2, color: "rgba(11,27,46,0.45)", fontSize: "0.85rem" }}>No articles yet.</Typography>
              )}
            </List>
          </Paper>

          <Paper elevation={0} sx={{ flex: 1, border: "1px solid rgba(11,27,46,0.1)", borderRadius: 2, p: { xs: 2, md: 3 } }}>
            {!selected && (
              <Typography sx={{ color: "rgba(11,27,46,0.55)" }}>Select an article or create a new one.</Typography>
            )}
            {selected && draft && (
              <Stack spacing={2.5}>
                <TextField
                  label="Title"
                  fullWidth
                  value={draft.title}
                  onChange={(e) => updateDraft({ title: e.target.value })}
                  onBlur={() => {
                    if (!draft.slug?.trim() && draft.title?.trim()) {
                      updateDraft({ slug: slugify(draft.title) });
                    }
                  }}
                />
                <TextField
                  label="URL slug"
                  fullWidth
                  helperText="Used in the address: /blog/your-slug"
                  value={draft.slug}
                  onChange={(e) => updateDraft({ slug: e.target.value })}
                />
                <TextField
                  label="Excerpt"
                  fullWidth
                  multiline
                  minRows={2}
                  value={draft.excerpt}
                  onChange={(e) => updateDraft({ excerpt: e.target.value })}
                  helperText="Shown in Google search results and on the blog list."
                />
                <TextField
                  label="Body"
                  fullWidth
                  multiline
                  minRows={12}
                  value={draft.body}
                  onChange={(e) => updateDraft({ body: e.target.value })}
                  placeholder="Plain text or paragraphs. Line breaks are preserved."
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!!draft.published}
                      onChange={(e) => updateDraft({ published: e.target.checked })}
                      sx={{ color: GOLD, "&.Mui-checked": { color: GOLD } }}
                    />
                  }
                  label="Published (shown on public blog)"
                />
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} flexWrap="wrap" useFlexGap>
                  <Button variant="contained" onClick={publishCurrent} disabled={busy} sx={{ bgcolor: GOLD, color: NAVY, fontWeight: 700 }}>
                    Publish to blog
                  </Button>
                  <Button variant="outlined" onClick={saveCurrent} disabled={busy} sx={{ borderColor: NAVY, color: NAVY }}>
                    Save draft
                  </Button>
                  {draft.published && (
                    <Button variant="outlined" color="warning" onClick={unpublishCurrent} disabled={busy}>
                      Unpublish
                    </Button>
                  )}
                  <Button color="error" variant="outlined" onClick={removeSelected} disabled={busy}>
                    Delete
                  </Button>
                </Stack>
              </Stack>
            )}

            <Divider sx={{ my: 4 }} />

            <Typography sx={{ fontWeight: 700, color: NAVY, mb: 1.5 }}>Import legacy posts</Typography>
            <Typography sx={{ color: "rgba(11,27,46,0.65)", fontSize: "0.88rem", lineHeight: 1.75, mb: 2 }}>
              Import a previous <strong>blog-data.json</strong> or workspace backup to move old articles into Convex.
            </Typography>
            <Button variant="outlined" onClick={() => fileImportRef.current?.click()} sx={{ borderColor: NAVY, color: NAVY }}>
              Import JSON
            </Button>
            <input ref={fileImportRef} type="file" accept="application/json,.json" hidden onChange={onImportFile} />
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
