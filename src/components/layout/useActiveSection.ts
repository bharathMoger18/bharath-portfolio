import { useEffect, useState } from 'react';

/**
 * Returns the id of the section currently crossing the reading line
 * (about 40% from the top of the viewport), or null.
 * Pass enabled=false on routes that have no sections.
 */
export function useActiveSection(ids: readonly string[], enabled: boolean): string | null {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join('|');

  useEffect(() => {
    if (!enabled || typeof IntersectionObserver === 'undefined') return;

    const elements = key
      .split('|')
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [key, enabled]);

  return enabled ? active : null;
}
