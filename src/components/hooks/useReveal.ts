import { useEffect, useRef, useState } from 'react';

/**
 * Reveal-on-scroll with a safe default: content is visible unless this hook
 * has positively decided to hide it.
 *
 * - `armed` is false on the server and on the first render, so the markup is
 *   fully visible without JavaScript or before hydration.
 * - Reduced motion: never armed, everything stays visible immediately.
 * - No IntersectionObserver: never armed.
 * - Elements already in (or above) the viewport on mount are never hidden,
 *   so there is no flash and no content waiting on a scroll.
 * - A fallback timer reveals everything if the observer never fires.
 *
 * Usage: const { ref, armed, revealed } = useReveal<HTMLDivElement>();
 *        <div ref={ref} data-reveal={armed ? (revealed ? 'in' : 'out') : undefined} />
 */
export interface UseRevealOptions {
  /** Fraction of the element that must be visible. Default 0.15. */
  threshold?: number;
  /** Reveal anyway after this many ms if the observer never fires. Default 2500. */
  fallbackMs?: number;
}

export interface UseRevealResult<T extends Element> {
  ref: React.RefObject<T | null>;
  /** True only when the element was below the fold and animation is allowed. */
  armed: boolean;
  /** True once the element has been revealed (or never needed hiding). */
  revealed: boolean;
}

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export function useReveal<T extends Element = HTMLElement>(
  options: UseRevealOptions = {},
): UseRevealResult<T> {
  const { threshold = 0.15, fallbackMs = 2500 } = options;
  const ref = useRef<T | null>(null);
  const [armed, setArmed] = useState(false);
  const [revealed, setRevealed] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') {
      return undefined;
    }

    // Already on screen or scrolled past: leave it visible.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) return undefined;

    setArmed(true);
    setRevealed(false);

    const show = () => setRevealed(true);
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          show();
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(el);
    const timer = window.setTimeout(() => {
      show();
      observer.disconnect();
    }, fallbackMs);

    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [threshold, fallbackMs]);

  return { ref, armed, revealed };
}
