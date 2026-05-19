import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import { Link as RouterLink, Navigate, useParams } from "react-router-dom";
import { BLOG_UPDATED_EVENT, fetchPublishedPosts } from "./blogStorage";

const NAVY = "#0B1B2E";
const GOLD = "#C8A96E";
const GOLD_DEEP = "#A78848";
const IVORY = "#FAFAF7";

function formatDate(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

function usePublishedPosts() {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const bundle = await fetchPublishedPosts();
      if (!cancelled) setPosts(bundle.posts);
    };
    load();
    const onUpdate = () => load();
    window.addEventListener(BLOG_UPDATED_EVENT, onUpdate);
    return () => {
      cancelled = true;
      window.removeEventListener(BLOG_UPDATED_EVENT, onUpdate);
    };
  }, []);

  return posts;
}

export function BlogListPage() {
  const posts = usePublishedPosts();

  return (
    <Box sx={{ bgcolor: IVORY, minHeight: "100vh", pt: { xs: 14, md: 16 }, pb: { xs: 8, md: 12 } }}>
      <Container maxWidth="md">
        <Typography
          variant="h2"
          sx={{
            fontWeight: 800,
            fontSize: { xs: "2rem", md: "2.6rem" },
            color: NAVY,
            mb: 1,
            lineHeight: 1.15,
          }}
        >
          Firm <Box component="span" sx={{ color: GOLD_DEEP }}>Blog</Box>
        </Typography>
        <Typography sx={{ color: "rgba(11,27,46,0.65)", mb: 5, maxWidth: 560, lineHeight: 1.8, fontWeight: 300 }}>
          Updates and insights from Collins Kipkemoi Sang & Company Advocates.
        </Typography>

        {posts === null && (
          <Typography sx={{ color: "rgba(11,27,46,0.5)" }}>Loading articles…</Typography>
        )}
        {posts && posts.length === 0 && (
          <Box sx={{ py: 6, textAlign: "center" }}>
            <Typography sx={{ color: "rgba(11,27,46,0.55)", mb: 2 }}>No published articles yet.</Typography>
            <Button component={RouterLink} to="/#contact" variant="outlined" sx={{ borderColor: GOLD, color: NAVY }}>
              Contact the firm
            </Button>
          </Box>
        )}
        <Stack spacing={2}>
          {posts &&
            posts.map((p) => (
              <Card key={p.id} elevation={0} sx={{ border: "1px solid rgba(11,27,46,0.08)", borderRadius: 2 }}>
                <CardActionArea component={RouterLink} to={`/blog/${encodeURIComponent(p.slug)}`}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography sx={{ fontSize: "0.72rem", color: GOLD_DEEP, fontWeight: 600, letterSpacing: 1.2, mb: 0.5 }}>
                      {formatDate(p.updatedAt || p.createdAt)}
                    </Typography>
                    <Typography sx={{ fontWeight: 800, fontSize: "1.25rem", color: NAVY, mb: 1 }}>
                      {p.title || "Untitled"}
                    </Typography>
                    <Typography sx={{ color: "rgba(11,27,46,0.65)", lineHeight: 1.7, fontWeight: 300 }}>
                      {p.excerpt || ""}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
        </Stack>
      </Container>
    </Box>
  );
}

export function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      const bundle = await fetchPublishedPosts();
      const decoded = slug ? decodeURIComponent(slug) : "";
      const found = bundle.posts.find((p) => p.slug === decoded);
      if (!cancelled) {
        setPost(found || null);
        setLoading(false);
      }
    };
    load();
    const onUpdate = () => load();
    window.addEventListener(BLOG_UPDATED_EVENT, onUpdate);
    return () => {
      cancelled = true;
      window.removeEventListener(BLOG_UPDATED_EVENT, onUpdate);
    };
  }, [slug]);

  if (!loading && !post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <Box sx={{ bgcolor: IVORY, minHeight: "100vh", pt: { xs: 14, md: 16 }, pb: { xs: 8, md: 12 } }}>
      <Container maxWidth="md">
        <Button component={RouterLink} to="/blog" sx={{ mb: 3, color: GOLD_DEEP, fontWeight: 600 }}>
          ← All posts
        </Button>
        {loading && <Typography sx={{ color: "rgba(11,27,46,0.5)" }}>Loading…</Typography>}
        {!loading && post && (
          <article>
            <Typography sx={{ fontSize: "0.72rem", color: GOLD_DEEP, fontWeight: 600, letterSpacing: 1.2, mb: 1 }}>
              {formatDate(post.updatedAt || post.createdAt)}
            </Typography>
            <Typography
              component="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: "1.75rem", md: "2.25rem" },
                color: NAVY,
                mb: 2,
                lineHeight: 1.2,
              }}
            >
              {post.title}
            </Typography>
            {post.excerpt ? (
              <Typography sx={{ color: "rgba(11,27,46,0.7)", fontSize: "1.05rem", lineHeight: 1.75, mb: 4, fontWeight: 400 }}>
                {post.excerpt}
              </Typography>
            ) : null}
            <Box
              sx={{
                color: "rgba(11,27,46,0.82)",
                fontSize: "1rem",
                lineHeight: 1.9,
                fontWeight: 300,
                whiteSpace: "pre-wrap",
              }}
            >
              {post.body}
            </Box>
          </article>
        )}
      </Container>
    </Box>
  );
}
