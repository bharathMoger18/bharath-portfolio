import type { ReactNode } from 'react';
import type { NumberFact } from '../../data/types.ts';
import Reveal from '../hooks/Reveal.tsx';
import Section from '../layout/Section.tsx';
import './NumbersStrip.css';

export interface NumbersStripProps {
  facts: NumberFact[];
  /** Section number shown as "06". Default 6. */
  index?: number;
  /** Defaults to "The system in <em>numbers</em>." */
  heading?: ReactNode;
}

/**
 * Big numbers from data only. Each one carries a caption that names its source
 * and, when the fact has them, evidence links. No counting animation: the
 * numbers are readable at once and never change under the reader.
 */
export default function NumbersStrip({ facts, index = 6, heading }: NumbersStripProps) {
  return (
    <Section
      id="numbers"
      index={index}
      label="Numbers"
      tone="tint"
      heading={
        heading ?? (
          <>
            The system in <em>numbers</em>.
          </>
        )
      }
    >
      <ul role="list" className="numbers">
        {facts.map((fact, i) => (
          <li key={fact.id} className="numbers__item">
            <Reveal className="numbers__card" step={i}>
              <p className="numbers__value">{fact.value}</p>
              <p className="numbers__label">{fact.label}</p>
              <p className="numbers__caption">{fact.caption}</p>
              {fact.evidence.length > 0 ? (
                <ul role="list" className="numbers__evidence" aria-label={`Evidence for ${fact.label}`}>
                  {fact.evidence.map((e) => (
                    <li key={e.url}>
                      <a href={e.url} target="_blank" rel="noopener noreferrer">
                        {e.label}
                        <span className="visually-hidden"> (opens in a new tab)</span>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}
