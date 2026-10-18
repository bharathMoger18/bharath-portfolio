import type { ReactNode } from 'react';
import type { Education } from '../../data/types.ts';
import Section from '../layout/Section.tsx';
import './sections.css';

export interface EducationSectionProps {
  /** Newest first. Any `kind` is rendered the same way. */
  items: Education[];
  /** Section number shown as "07". Default 7. */
  index?: number;
  /** Defaults to "<em>Education</em>." */
  heading?: ReactNode;
}

/** Plain, dated list. Each entry shows only the fields the data has. */
export default function EducationSection({ items, index = 7, heading }: EducationSectionProps) {
  return (
    <Section
      id="education"
      index={index}
      label="Education"
      heading={
        heading ?? (
          <>
            <em>Education</em>.
          </>
        )
      }
    >
      <ol role="list" className="timeline">
        {items.map((item) => {
          const place = [item.institution, item.location].filter(Boolean).join(', ');
          return (
            <li key={item.id} className="timeline__item">
              <p className="label timeline__when">{item.period}</p>
              <div className="timeline__what">
                <h3 className="timeline__title">{item.degree ?? item.institution}</h3>
                {item.degree ? <p className="timeline__place">{place}</p> : null}
                {item.grade ? (
                  <p className="timeline__grade">
                    {item.grade.label} {item.grade.value}
                  </p>
                ) : null}
                {item.note ? <p className="timeline__note">{item.note}</p> : null}
              </div>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
