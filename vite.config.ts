import { defineConfig } from 'vite';
import type { Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import {
  OG_IMAGE_ALT,
  OG_IMAGE_PATH,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
  THEME_COLOR,
} from './src/site.constants.ts';

const escapeAttr = (value: string) =>
  value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');

/** Fills %PLACEHOLDERS% in index.html from src/site.constants.ts (dev and build). */
function htmlConstants(): Plugin {
  const values: Record<string, string> = {
    SITE_URL,
    SITE_NAME,
    SITE_TITLE,
    SITE_DESCRIPTION,
    OG_IMAGE_URL: `${SITE_URL}${OG_IMAGE_PATH}`,
    OG_IMAGE_ALT,
    THEME_COLOR,
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
