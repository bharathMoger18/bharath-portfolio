import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Client-side routing does not scroll to #hash or reset scroll by itself.
 * - hash present: scroll to that element and move focus there
 * - route changed: scroll to top and move focus to #main (screen readers)
 * The initial page load never steals focus. React Router gives the initial
 * location the key "default", which is safe under StrictMode's double effects.
 */
export default function ScrollToHash() {
  const location = useLocation();
  const lastPath = useRef(location.pathname);

  useEffect(() => {
    const isInitial = location.key === 'default';
    const pathChanged = lastPath.current !== location.pathname;
    lastPath.current = location.pathname;
    let cancelled = false;

    if (location.hash) {
      const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (target) {
        // Deep links jump instantly; in-app navigation follows the CSS
        // scroll-behavior (smooth, or instant under reduced motion).
        target.scrollIntoView({ behavior: isInitial ? 'instant' : 'auto' });
        if (!isInitial) {
          target.setAttribute('tabindex', '-1');
          target.focus({ preventScroll: true });
        } else if ('fonts' in document) {
          // Web fonts swapping in can change heights above the target.
          // Re-align once, unless the visitor has already scrolled.
          const y = window.scrollY;
          void document.fonts.ready.then(() => {
            if (!cancelled && Math.abs(window.scrollY - y) < 2) {
              target.scrollIntoView({ behavior: 'instant' });
            }
          });
        }
        return () => {
          cancelled = true;
        };
      }
    }

    if (!isInitial && pathChanged) {
      window.scrollTo(0, 0);
      document.getElementById('main')?.focus({ preventScroll: true });
    }
    return undefined;
  }, [location.key, location.pathname, location.hash]);

  return null;
}
