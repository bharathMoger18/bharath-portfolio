import type { ReactNode } from 'react';
import type { EvidenceLink } from '../../data/types.ts';
import Section from '../layout/Section.tsx';
import './sections.css';

/** Structural match for data/principles.ts, so this component imports no data file. */
export interface PrincipleItem {
  id: string;
  title: string;
  body: string;
  evidence: EvidenceLink[];
}

export interface PrinciplesSectionProps {
  items: PrincipleItem[];
  /** Section number shown as "05". Default 5. */
  index?: number;
  /** Defaults to "How I <em>work</em>." */
  heading?: ReactNode;
}

/** Numbered list: a short title, one honest paragraph, and links to the files that back it. */
export default function PrinciplesSection({ items, index = 5, heading }: PrinciplesSectionProps) {
  return (
    <Section
      id="principles"
      index={index}
      label="Principles"
      heading={
        heading ?? (
          <>
            How I <em>work</em>.
          </>
        )
      }
    >
      <ol role="list" className="principles">
        {items.map((item, i) => (
          <li key={item.id} className="principles__item">
            <p className="label principles__num" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </p>
            <div className="principles__what">
              <h3 className="principles__title">{item.title}</h3>
              <p className="principles__body">{item.body}</p>
              {item.evidence.length > 0 ? (
                <ul role="list" className="principles__evidence" aria-label={`Evidence for: ${item.title}`}>
                  {item.evidence.map((e) => (
                    <li key={e.url}>
                      <a href={e.url} target="_blank" rel="noopener noreferrer">
                        {e.label}
                        <span className="visually-hidden"> (opens in a new tab)</span>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
