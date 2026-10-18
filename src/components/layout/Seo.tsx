import { useEffect } from 'react';
// Site-wide strings come from the same file vite.config.ts injects into index.html.
import { SITE } from '../../data/site.ts';

export interface SeoProps {
  title: string;
  description?: string;
  /** Route path, e.g. "/resume". Becomes the canonical and og:url. */
  path: string;
  /** Adds robots noindex and removes the canonical (used by /lab and 404). */
  noindex?: boolean;
}

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(href: string | null) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (href === null) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

/**
 * Per-route head tags. index.html ships static defaults for crawlers that do not
 * run JavaScript (social scrapers); this keeps title, description, canonical and
 * social tags correct for each client-side route without duplicating tags.
 * A single static canonical would mark every route as a copy of the home page.
 */
export default function Seo({ title, description = SITE.description, path, noindex = false }: SeoProps) {
  useEffect(() => {
    const url = `${SITE.url}${path === '/' ? '/' : path.replace(/\/$/, '')}`;
    document.title = title;
    setMeta('name', 'description', description);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:image', `${SITE.url}${SITE.ogImage}`);
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setCanonical(noindex ? null : url);

    if (noindex) {
      setMeta('name', 'robots', 'noindex');
      return () => {
        document.head.querySelector('meta[name="robots"]')?.remove();
      };
    }
    return undefined;
  }, [title, description, path, noindex]);

  return null;
}
