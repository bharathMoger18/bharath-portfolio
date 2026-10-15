/*
 * Single source for site-wide SEO strings. Pure constants with no imports, so
 * vite.config.ts (index.html injection) and the Seo component share them.
 * TODO(D): Account D's src/data/site.ts (SiteMeta) takes over; keep these in sync until then.
 * Copy uses only CONFIRMED rows of docs/FACTS.md (project titles, Docker, Jenkins, Terraform).
 * It makes no "live" claim (DECISIONS #2, #6).
 */
export const SITE_URL = 'https://portfolio.bharathops.online';
export const SITE_NAME = 'Bharath Moger';
export const SITE_TITLE = 'Bharath Moger | DevOps Portfolio';
export const SITE_DESCRIPTION =
  'Portfolio of Bharath Moger: a self-built Kubernetes platform and an AWS EKS deployment, with Docker, Jenkins and Terraform. Resume and contact inside.';
export const OG_IMAGE_PATH = '/og-image.png';
export const OG_IMAGE_ALT = 'Bharath Moger, DevOps portfolio';
export const THEME_COLOR = '#f5f1e9';
