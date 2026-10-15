import Section from '../layout/Section.tsx';
import Reveal from '../hooks/Reveal.tsx';
import EngineerBadge from './EngineerBadge.tsx';
import type { EngineerBadgeProps } from './EngineerBadge.tsx';
import './About.css';

export interface AboutProps {
  /** Section number shown as "01". Default 1. */
  index?: number;
  /** About copy, one string per paragraph. Supplied by Account D. */
  paragraphs: string[];
  badge: EngineerBadgeProps;
  /** Heading name, wrapped in <em>. */
  headingName: string;
}

export default function About({ index = 1, paragraphs, badge, headingName }: AboutProps) {
  return (
    <Section
      id="about"
      index={index}
      label="About"
      heading={
        <>
          Hi, I&apos;m <em>{headingName}</em>.
        </>
      }
    >
      <div className="about">
        <Reveal className="about__copy">
          {paragraphs.map((text, i) => (
            <p key={i}>{text}</p>
          ))}
        </Reveal>
        <Reveal className="about__badge" step={1}>
          <EngineerBadge {...badge} />
        </Reveal>
      </div>
    </Section>
  );
}
