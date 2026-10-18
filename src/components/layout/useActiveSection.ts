import { useEffect, useState } from 'react';

/** Reading line: a section counts once its top is this far down the viewport. */
const READING_LINE = 0.4;

/**
 * Returns the id of the current section, or null.
 *
 * The current section is the last one (in the order of `ids`) whose top has
 * reached the reading line (40% down the viewport). So nothing is active while
 * the visitor is still above the first section, and at the very top of the page
 * (the hero), and the answer is recomputed on every scroll, so scrolling back up
 * clears it again.
 *
 * Pass enabled=false on routes that have no sections.
 */
export function useActiveSection(ids: readonly string[], enabled: boolean): string | null {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join('|');

  useEffect(() => {
    if (!enabled) return;

    const elements = key
      .split('|')
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      let current: string | null = null;
      if (window.scrollY > 0) {
        const line = window.innerHeight * READING_LINE;
        for (const el of elements) {
          if (el.getBoundingClientRect().top <= line) current = el.id;
        }
      }
      setActive(current);
    };
    const schedule = () => {
      if (frame === 0) frame = requestAnimationFrame(update);
    };

    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    // Heights change as fonts and images load; recompute when the page grows or shrinks.
    const resizeObserver =
      typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(schedule);
    resizeObserver?.observe(document.body);

    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      resizeObserver?.disconnect();
      if (frame !== 0) cancelAnimationFrame(frame);
    };
  }, [key, enabled]);

  return enabled ? active : null;
}
