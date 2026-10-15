import type { ReactNode } from 'react';
import './Section.css';

export interface SectionProps {
  /** Anchor id and nav target, e.g. "about". */
  id: string;
  /** 1-based number shown as "01". */
  index: number;
  /** Short label shown as "01 / ABOUT". */
  label: string;
  /** Heading content. Wrap the one italic word in <em>. */
  heading: ReactNode;
  tone?: 'default' | 'tint' | 'dark';
  children?: ReactNode;
}

export default function Section({
  id,
  index,
  label,
  heading,
  tone = 'default',
  children,
}: SectionProps) {
  const headingId = `${id}-heading`;
  return (
    <section id={id} className={`section section--${tone}`} aria-labelledby={headingId}>
      <div className="container">
        <p className="label section__label">
          <span aria-hidden="true">{String(index).padStart(2, '0')} / </span>
          {label}
        </p>
        <h2 id={headingId} className="section__heading">
          {heading}
        </h2>
        {children ? <div className="section__body">{children}</div> : null}
      </div>
    </section>
  );
}
