export const SITE_URL = "https://kipkemoiadvocates.org";
export const BRAND_SHORT = "Kipkemoi Advocates";
export const BRAND_FULL = "Collins Kipkemoi Sang & Company Advocates";

export function pageTitle(title) {
  return `${title} | ${BRAND_SHORT}`;
}

export function blogPostUrl(slug) {
  return `${SITE_URL}/blog/${encodeURIComponent(slug)}`;
}
