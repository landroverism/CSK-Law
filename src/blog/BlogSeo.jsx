import { Helmet } from "react-helmet-async";
import { BRAND_FULL, BRAND_SHORT, SITE_URL, blogPostUrl, pageTitle } from "./siteConfig";

export function SiteSeo({ title, description, path = "/" }) {
  const fullTitle = title.includes(BRAND_SHORT) ? title : pageTitle(title);
  const url = `${SITE_URL}${path === "/" ? "" : path}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description ? <meta name="description" content={description} /> : null}
      <link rel="canonical" href={url} />
      <meta property="og:title" content={fullTitle} />
      {description ? <meta property="og:description" content={description} /> : null}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={BRAND_SHORT} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description ? <meta name="twitter:description" content={description} /> : null}
    </Helmet>
  );
}

export function BlogListSeo() {
  return (
    <SiteSeo
      title="Legal Insights & Updates"
      description="Legal insights, firm news, and practical guidance from Kipkemoi Advocates in Nairobi, Kenya."
      path="/blog"
    />
  );
}

export function BlogPostSeo({ post }) {
  if (!post) return null;

  const title = post.title || "Article";
  const description = post.excerpt || `${title} — published by ${BRAND_SHORT}.`;
  const url = blogPostUrl(post.slug);
  const fullTitle = pageTitle(title);
  const published = new Date(post.createdAt).toISOString();
  const modified = new Date(post.updatedAt).toISOString();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    author: {
      "@type": "Organization",
      name: BRAND_SHORT,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: BRAND_FULL,
      url: SITE_URL,
    },
    datePublished: published,
    dateModified: modified,
    mainEntityOfPage: url,
    url,
  };

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={BRAND_SHORT} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
}
