import { defineConfig } from 'vite';
import type { Plugin } from 'vite';
import react from '@vitejs/plugin-react';
// Single source of the site-wide strings. data/site.ts has a type-only import,
// so it is safe for the config to load. Keep it free of runtime imports.
import { OG_IMAGE_ALT, SITE } from './src/data/site.ts';

const escapeAttr = (value: string) =>
  value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');

/** Fills %PLACEHOLDERS% in index.html from src/data/site.ts (dev and build). */
function htmlConstants(): Plugin {
  const values: Record<string, string> = {
    SITE_URL: SITE.url,
    SITE_NAME: SITE.name,
    SITE_TITLE: SITE.title,
    SITE_DESCRIPTION: SITE.description,
    SITE_LOCALE: SITE.locale,
    TWITTER_CARD: SITE.twitterCard,
    OG_IMAGE_URL: `${SITE.url}${SITE.ogImage}`,
    OG_IMAGE_ALT,
    THEME_COLOR: SITE.themeColor,
  };
  return {
    name: 'html-constants',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return html.replace(/%([A-Z_]+)%/g, (match, key: string) => {
          const value = values[key];
          return value === undefined ? match : escapeAttr(value);
        });
      },
    },
  };
}

export default defineConfig({
  plugins: [react(), htmlConstants()],
});
