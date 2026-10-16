import { useId } from 'react';
import type { ReactNode } from 'react';
import './diagrams.css';

export interface DiagramScroll {
  /** Minimum width of the content, any CSS length, e.g. "56rem". */
  minWidth: string;
  /** Visible label that tells the reader the area scrolls sideways. */
  label: string;
}

export interface DiagramFrameProps {
  title: string;
  caption?: ReactNode;
  /** Plain text version of the diagram. Blank lines start a new paragraph. */
  textAlternative: string;
  /** Honest status line shown above the picture, e.g. "Completed deployment, infrastructure torn down". */
  status?: string;
  /**
   * Accessible name for a static picture. When set, the visual is exposed as one
   * image (role="img") and the text alternative carries the detail.
   * Leave unset when the visual is interactive (tabs, buttons).
   */
  visualLabel?: string;
  /** Last resort only: wrap in a labeled, keyboard-focusable sideways scroller. */
  scroll?: DiagramScroll;
  children: ReactNode;
}

/**
 * Wrapper for every diagram: title, caption, the picture, and a visible
 * "Read as text" disclosure (native details/summary, keyboard operable).
 */
export default function DiagramFrame({
  title,
  caption,
  textAlternative,
  status,
  visualLabel,
  scroll,
  children,
}: DiagramFrameProps) {
  const uid = useId();
  const titleId = `${uid}-title`;
  const scrollNoteId = `${uid}-scroll`;
  const paragraphs = textAlternative.split(/\n\s*\n/).filter((p) => p.trim().length > 0);

  const visual = (
    <div
      className="dg__visual"
      role={visualLabel ? 'img' : undefined}
      aria-label={visualLabel ? `${visualLabel} Full description under Read as text.` : undefined}
    >
      {children}
    </div>
  );

  return (
    <figure className="dg" aria-labelledby={titleId}>
      <figcaption className="dg__head">
        <span id={titleId} className="dg__title">
          {title}
        </span>
        {caption ? <span className="dg__caption">{caption}</span> : null}
        {status ? (
          <span className="dg__status">
            <span className="dg__status-key">Status</span>
            {status}
          </span>
        ) : null}
      </figcaption>

      {scroll ? (
        <>
          <p id={scrollNoteId} className="dg__scroll-note">
            {scroll.label}
          </p>
          <div
            className="dg__scroll"
            role="region"
            tabIndex={0}
            aria-labelledby={scrollNoteId}
            style={{ ['--dg-scroll-min' as string]: scroll.minWidth }}
          >
            {visual}
          </div>
        </>
      ) : (
        visual
      )}

      <details className="dg__alt">
        <summary>Read as text</summary>
        <div className="dg__alt-body">
          {paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </details>
    </figure>
  );
}
